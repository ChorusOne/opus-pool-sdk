import { OpusPool } from '..';
import { StakewiseConnector } from '../internal/connector';
import type { VaultDetails } from '../types/vault'
import { VaultABI } from '../internal/contracts/vaultAbi';
import {default as AsyncLock} from 'async-lock';
import { Hex } from 'viem';


interface StakewiseDailySnapshot {
  rewardPerAsset: string
}

interface VaultProperties {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  vaultData: any,
  apy: number,
}


// Some properties don't change often, so we load them on a first request only
const cachedVaultProperties = new Map<string, VaultProperties>();
const cacheLock = new AsyncLock();

// Extracts Vault properties from Stakewise API
async function extractVaultProperties(connector: StakewiseConnector, vault: Hex): Promise<VaultProperties> {
  const vars_getVault = {
    address:  vault.toLowerCase(),
  };

  const today= new Date();
  const dateBeforeYesterday = new Date();
  dateBeforeYesterday.setDate(dateBeforeYesterday.getDate() - 8);
  today.setDate(today.getDate());

  const vars_getSnapshot = {
    where: {
      date_gte: parseInt((dateBeforeYesterday.getTime() / 1000).toFixed(0)),
      vault_: { id: vault.toLowerCase() },
    },
    whereFirstSnapshots: {
      date_lt: parseInt((today.getTime() / 1000).toFixed(0)),
      vault_: { id: vault.toLowerCase() },
    },
  };

  const maybeVault = connector.graphqlRequest({
    type: 'graph',
    op: 'Vault',
    query: `
query Vault($address: ID!) 
{ 
    vault(id: $address) { 
      address: id 
      performance: score 
      admin 
      isErc20 
      imageUrl 
      verified 
      capacity
      createdAt
      tokenName
      feePercent
      totalAssets
      displayName
      description
      whitelister
      keysManager
      tokenSymbol
      feeRecipient 
      validatorsRoot
      avgRewardPerAsset
    } privateVaultAccounts( where: { vault: $address } ) 
    { createdAt address }}`,
    variables: vars_getVault,
    onSuccess: function (value: Response): Response {
      return value
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: function (reason: any): PromiseLike<never> {
      throw new Error(`Failed to get vault from Stakewise: ${reason}`);
    }
  });

  const maybeSnapshots = connector.graphqlRequest({
    type: 'graph',
    op: 'DaySnapshots',
    query: `
    query DaySnapshots(
        $where: DaySnapshot_filter
        $whereFirstSnapshots: DaySnapshot_filter
      ) {
        daySnapshots(where: $where) {
          date totalAssets rewardPerAsset
        }
        firstSnapshots: daySnapshots(where: $whereFirstSnapshots, first: 1) {
          date totalAssets rewardPerAsset
        }
      }
    `,
    variables: vars_getSnapshot,
    onSuccess: function (value: Response): Response {
      return value
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: function (reason: any): PromiseLike<never> {
      throw new Error(`Failed to get vault from Stakewise: ${reason}`);
    }
  });

  const detailGraphResponses = await Promise.all([
    maybeVault,
    maybeSnapshots,
  ])
  const responseVault = detailGraphResponses[0];
  const responseSnapshots = detailGraphResponses[1];

  if ((responseVault.status != 200) || (responseSnapshots.status != 200)) {
    throw new Error("Invalid response code from Stakewise")
  }

  const detailGraphDatas = await Promise.all([
    responseVault.json(),
    responseSnapshots.json(),
  ])
  const vaultData = detailGraphDatas[0];
  const snapshotsData = detailGraphDatas[1];

  // Stakewise uses 7d APY, but at very start of the vault
  let aggregateApy = 0.0;
  let apyPoints = 0;
  snapshotsData.data.daySnapshots.forEach((snapshot: StakewiseDailySnapshot) => {
    const apy = (Number(snapshot.rewardPerAsset)  || 0) * 365 * 100;
    if (apy > 0) {
      aggregateApy += apy;
      apyPoints += 1;
    }
  });
  // some days might be missing, so we extrapolate here
  const apy: number = aggregateApy / (7.0 / (apyPoints / 7.0));

  return {vaultData, apy}
}

// Get latest balance and cached properties
async function extractVaultDetails(connector: StakewiseConnector, vault: Hex, allocatorAddress: string): Promise<VaultDetails> {
  const vaultProperties: VaultProperties = await cacheLock.acquire(vault, async function() {
    // Concurrency safe
    let props;
    if (!cachedVaultProperties.has(vault)) {
      props = await extractVaultProperties(connector, vault)
      cachedVaultProperties.set(vault, props);
    } else {
      const maybeProperties = cachedVaultProperties.get(vault)
      if (typeof maybeProperties === 'undefined') {
        throw new Error(`Can not load vault properties for ${vault}`)
      } else {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        props = maybeProperties!;
      }
    }
    return props
  });

  const userShares: bigint = await connector.eth.readContract({
    address: vault,
    abi: VaultABI,
    functionName: 'getShares',
    args: [`0x${allocatorAddress.replace('0x', '')}`],
  })

  const assets: bigint = await connector.eth.readContract({
    abi: VaultABI,
    address: vault,
    functionName: 'convertToAssets',
    args: [userShares]
  });

  const vaultData = vaultProperties.vaultData;

  return {
    address: vault,
    name: vaultData.data.vault.displayName,
    description: vaultData.data.vault.description,
    logoUrl: vaultData.data.vault.imageUrl,
    tvl: BigInt(vaultData.data.vault.totalAssets),
    apy: vaultProperties.apy,
    balance: assets,
  }
}


export default async function vaultDetails(pool: OpusPool, vaults: Array<Hex>): Promise<Array<VaultDetails>> {
    const vaultDetailPromises: Array<Promise<VaultDetails>> = [];

    vaults.forEach((vault: Hex) => {
        const vaultPromise = extractVaultDetails(pool.connector, vault, pool.userAccount);
        vaultDetailPromises.push(vaultPromise);
    });
    const vaultDetails = await Promise.all(vaultDetailPromises);
    return vaultDetails;
}

