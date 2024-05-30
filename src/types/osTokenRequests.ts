import { OsTokenPositionHealth } from './enums';

/**
 * Represents the osToken position of a staker in the vault.
 */
export interface OsTokenPositionReturnType {
    /**
     * Contains details about the minted osETH
     */
    minted: {
        /** Total amount of osETH minted */
        assets: bigint;
        /** Corresponding shares of the pooled ETH represented as minted osETH. */
        shares: bigint;
        /** Fee incurred during the minting process, calculated based on the shares of osETH minted. */
        fee: bigint;
    };
    /**
     * The health status of the osETH position, determining the risk based on collateralization.
     */
    health: OsTokenPositionHealth;
    /**
     * Protocol fee percentage on the rewards accumulated in osETH.
     */
    protocolFeePercent: bigint;
}

export interface OsTokenDataReturnType {
    rate: string;
    ltvPercent: bigint;
    thresholdPercent: bigint;
}

/**
 * Represents the balance of a staker in the vault.
 */
export interface StakeBalanceReturnType {
    /** The total amount of ETH staked by the staker. */
    assets: bigint;
    /** Corresponding shares of the staked ETH in the vault. */
    shares: bigint;
}
