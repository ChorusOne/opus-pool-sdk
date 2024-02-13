import { OpusPool } from '..';
import { StakewiseConnector } from '../internal/connector';
import type { VaultDetails } from '../types/vault';
import { VaultABI } from '../internal/contracts/vaultAbi';
import { default as AsyncLock } from 'async-lock';
import { Hex } from 'viem';
interface VaultProperties {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vaultData: any;
}

// Some properties don't change often, so we load them on a first request only
const cachedVaultProperties = new Map<string, VaultProperties>();
const cacheLock = new AsyncLock();

// Extracts Vault properties from Stakewise API
async function extractVaultProperties(connector: StakewiseConnector, vault: Hex): Promise<VaultProperties> {
    const vars_getVault = {
        address: vault.toLowerCase(),
    };

    const today = new Date();
    const dateBeforeYesterday = new Date();
    dateBeforeYesterday.setDate(dateBeforeYesterday.getDate() - 8);
    today.setDate(today.getDate());

    const vaultData = await connector.graphqlRequest({
        type: 'graph',
        op: 'Vault',
        query: `
            query Vault($address: ID!) {
              vault(id: $address) {
                address: id
                performance: score
                admin
                isErc20
                imageUrl
                capacity
                mevEscrow
                isPrivate
                createdAt
                mevEscrow
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
                weeklyApy
              }
              privateVaultAccounts(
                where: { vault: $address }
              ) {
                createdAt
                address
              }
            }`,
        variables: vars_getVault,
    });

    if (!vaultData.data.vault) {
        throw new Error(`Vault data is missing the vault field`);
    }
    return { vaultData: vaultData.data };
}

// Get latest balance and cached properties
async function extractVaultDetails(
    connector: StakewiseConnector,
    vault: Hex,
    allocatorAddress: string,
): Promise<VaultDetails> {
    const vaultProperties: VaultProperties = await cacheLock.acquire(vault, async function () {
        // Concurrency safe
        let props;
        if (!cachedVaultProperties.has(vault)) {
            props = await extractVaultProperties(connector, vault);
            cachedVaultProperties.set(vault, props);
        } else {
            const maybeProperties = cachedVaultProperties.get(vault);
            if (typeof maybeProperties === 'undefined') {
                throw new Error(`Can not load vault properties for ${vault}`);
            } else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                props = maybeProperties!;
            }
        }
        return props;
    });

    const userShares: bigint = await connector.eth.readContract({
        address: vault,
        abi: VaultABI,
        functionName: 'getShares',
        args: [`0x${allocatorAddress.replace('0x', '')}`],
    });

    const assets: bigint = await connector.eth.readContract({
        abi: VaultABI,
        address: vault,
        functionName: 'convertToAssets',
        args: [userShares],
    });

    const vaultData = vaultProperties.vaultData;

    return {
        address: vault,
        name: vaultData.vault.displayName,
        description: vaultData.vault.description,
        logoUrl: vaultData.vault.imageUrl,
        tvl: BigInt(vaultData.vault.totalAssets),
        apy: vaultData.vault.weeklyApy > 0 ? vaultData.vault.weeklyApy : '0',
        balance: assets,
    };
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
