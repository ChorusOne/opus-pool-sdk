import { Hex, parseEther } from 'viem';
import { OpusPool } from '..';
import { MintTokenConfigAbi } from './contracts/mintTokenConfigAbi';
import { PriceOracleAbi } from './contracts/priceOracleAbi';
import { VaultABI } from './contracts/vaultAbi';
import { MintTokenControllerAbi } from './contracts/mintCotrollerAbi';
import { Decimal } from 'decimal.js';
import { OsTokenPositionHealth } from '../types/enums';
import type {
    OsTokenDataReturnType,
    OsTokenPositionReturnType,
    StakeBalanceReturnType,
} from '../types/osTokenRequests';

export const getHealthFactor = async (
    pool: OpusPool,
    mintedAssets: bigint,
    stakedAssets: bigint,
): Promise<OsTokenPositionHealth> => {
    if (mintedAssets === 0n || stakedAssets === 0n) {
        return OsTokenPositionHealth.Healthy;
    }
    const { thresholdPercent } = await getBaseData(pool);

    const healthFactor = new Decimal(stakedAssets.toString())
        .mul(thresholdPercent.toString())
        .div(mintedAssets.toString())
        .div(10_000)
        .toDecimalPlaces(4)
        .toNumber();

    let result = OsTokenPositionHealth.Unhealthy;

    // If healthFactor = 1, then position is Healthy, but we need to add
    // a small gap to notify the user in advance of problems with the position
    if (healthFactor >= 1.02) {
        result = OsTokenPositionHealth.Healthy;
    } else if (healthFactor >= 1.01) {
        result = OsTokenPositionHealth.Moderate;
    } else if (healthFactor >= 1.0) {
        result = OsTokenPositionHealth.Risky;
    } else {
        result = OsTokenPositionHealth.Unhealthy;
    }

    return result;
};

export const getMaxMint = async (pool: OpusPool, vault_address: Hex): Promise<bigint> => {
    const { ltvPercent } = await getBaseData(pool);
    const { assets } = await getStakeBalance(pool, vault_address);
    const osToken = await getOsTokenPosition(pool, vault_address);

    if (ltvPercent <= 0n || assets <= 0n) {
        return 0n;
    }

    const avgRewardPerSecond = (await pool.connector.eth.readContract({
        abi: MintTokenControllerAbi,
        functionName: 'avgRewardPerSecond',
        address: pool.connector.mintTokenController,
    })) as bigint;

    const maxMintedAssets: bigint = (assets * ltvPercent) / 10_000n;

    const maxMintedAssetsHourReward: bigint =
        (maxMintedAssets * avgRewardPerSecond * 3600n) / 1_000_000_000_000_000_000n;
    const canMintAssets = maxMintedAssets - maxMintedAssetsHourReward - osToken.minted.assets;

    if (canMintAssets > 0) {
        const maxMintShares = (await pool.connector.eth.readContract({
            abi: MintTokenControllerAbi,
            functionName: 'convertToShares',
            address: pool.connector.mintTokenController,
            args: [canMintAssets],
        })) as bigint;

        return maxMintShares;
    }

    return 0n;
};

export const getBaseData = async (pool: OpusPool): Promise<OsTokenDataReturnType> => {
    const publicClient = pool.connector.eth;
    const mintTokenRatePromise = publicClient.readContract({
        abi: PriceOracleAbi,
        functionName: 'latestAnswer',
        address: pool.connector.priceOracle,
    }) as Promise<bigint>;
    const ltvPercentPromise = publicClient.readContract({
        abi: MintTokenConfigAbi,
        functionName: 'ltvPercent',
        address: pool.connector.mintTokenConfig,
    }) as Promise<bigint>;
    const thresholdPercentPromise = publicClient.readContract({
        abi: MintTokenConfigAbi,
        functionName: 'liqThresholdPercent',
        address: pool.connector.mintTokenConfig,
    }) as Promise<bigint>;
    const [mintTokenRate, ltvPercent, thresholdPercent] = await Promise.all([
        mintTokenRatePromise,
        ltvPercentPromise,
        thresholdPercentPromise,
    ]);
    // ETH per osETH exchange rate
    const rate = new Decimal(mintTokenRate.toString()).div(1_000_000_000_000_000_000).toString();
    return {
        rate,
        ltvPercent,
        thresholdPercent, // minting threshold, max 90%
    };
};

export const getStakeBalance = async (pool: OpusPool, vaultAddress: Hex): Promise<StakeBalanceReturnType> => {
    const publicClient = pool.connector.eth;
    const shares = (await publicClient.readContract({
        abi: VaultABI,
        address: vaultAddress,
        functionName: 'getShares',
        args: [pool.userAccount],
    })) as bigint;

    const assets = (await publicClient.readContract({
        abi: VaultABI,
        address: vaultAddress,
        functionName: 'convertToAssets',
        args: [shares],
    })) as bigint;

    return {
        shares: shares || 0n,
        assets: assets || 0n,
    };
};

export const getOsTokenPosition = async (pool: OpusPool, vaultAddress: Hex): Promise<OsTokenPositionReturnType> => {
    try {
        const gqlMintedSharesJson = await pool.connector.graphqlRequest({
            op: 'OsTokenPositions',
            type: 'graph',
            query: `
            query OsTokenPositions($address: Bytes, $vaultAddress: String) { osTokenPositions(where: { address: $address, vault: $vaultAddress }) { shares }}
            `,
            variables: {
                vaultAddress,
                address: pool.userAccount,
            },
            onSuccess: (value: { data: any }) => value,
            onError: (reason: any) => Promise.reject(reason),
        });

        if (!gqlMintedSharesJson.data.osTokenPositions || gqlMintedSharesJson.data.osTokenPositions.length === 0) {
            throw new Error(
                `Minted shares data is missing the osTokenPositions field or the field is empty ${gqlMintedSharesJson.data.osTokenPositions}`,
            );
        }
        const gqlMintedShares = BigInt(gqlMintedSharesJson.data.osTokenPositions[0]?.shares || 0);

        const mintedShares = await pool.connector.eth.readContract({
            abi: VaultABI,
            functionName: 'osTokenPositions',
            address: vaultAddress,
            args: [pool.userAccount],
        });

        const [mintedAssets, feePercent] = await Promise.all([
            pool.connector.eth.readContract({
                abi: MintTokenControllerAbi,
                address: pool.connector.mintTokenController,
                functionName: 'convertToAssets',
                args: [mintedShares],
            }) as Promise<bigint>,
            pool.connector.eth.readContract({
                abi: MintTokenControllerAbi,
                functionName: 'feePercent',
                address: pool.connector.mintTokenController,
            }) as Promise<bigint>,
        ]);
        const protocolFeePercent = feePercent / 100n;
        const { assets } = await getStakeBalance(pool, vaultAddress);

        const health = await pool.getHealthFactorForUser(mintedAssets, assets);

        return {
            minted: {
                assets: mintedAssets,
                shares: mintedShares,
                fee: mintedShares - gqlMintedShares,
            },
            health,
            protocolFeePercent,
        };
    } catch (error) {
        throw new Error(`Error retrieving osToken positions: ${error instanceof Error ? error.message : error}`);
    }
};

export const getMaxWithdraw = async (pool: OpusPool, vault: Hex): Promise<bigint> => {
    const min = parseEther('0.00001');
    const { ltvPercent } = await getBaseData(pool);
    const { assets } = await getStakeBalance(pool, vault);
    const { minted } = await getOsTokenPosition(pool, vault);
    if (ltvPercent <= 0 || assets < min) {
        return 0n;
    }
    const avgRewardPerSecond = (await pool.connector.eth.readContract({
        abi: MintTokenControllerAbi,
        functionName: 'avgRewardPerSecond',
        address: pool.connector.mintTokenController,
    })) as bigint;
    const secondsInHour = 60n * 60n;
    const gap = (avgRewardPerSecond * secondsInHour * minted.assets) / 1000000000000000000n;
    const lockedAssets = ((minted.assets + gap) * 10_000n) / ltvPercent;
    const maxWithdrawAssets = assets - lockedAssets;

    return maxWithdrawAssets > min ? maxWithdrawAssets : 0n;
};
