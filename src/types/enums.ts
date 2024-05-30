/**
 * Enum representing different supported blockchain networks.
 */
export enum Networks {
    /** The Ethereum mainnet. */
    Ethereum = 'ethereum',
    /** The Holesky testnet. */
    Holesky = 'holesky',
    /** The Hardhat local development network. */
    /** @ignore */
    Hardhat = 'hardhat',
}

/**
 * Enum for types of actions related to vault operations.
 */
export enum VaultActionType {
    /** Vault creation. */
    VaultCreated = 'VaultCreated',
    /** Deposit into the vault. */
    Deposited = 'Deposited',
    /** Redemption of assets from the vault. */
    Redeemed = 'Redeemed',
    /** Claiming exited assets. */
    ExitedAssetsClaimed = 'ExitedAssetsClaimed',
    /** Minting osToken. */
    OsTokenMinted = 'OsTokenMinted',
    /** Burning osToken. */
    OsTokenBurned = 'OsTokenBurned',
    /** Redemption of osToken. */
    OsTokenRedeemed = 'OsTokenRedeemed',
    /** Liquidation of osToken. */
    OsTokenLiquidated = 'OsTokenLiquidated',
    /** Migration from StakeWise v2. */
    Migrated = 'Migrated',
}

/**
 * Position health tracks the value of osETH minted by stakers relative to the value of their ETH stake in the vault.
 * Healthy positions have minted osETH that is well-collateralized by staked ETH. As the proportion of minted osETH
 * increases relative to staked ETH, position health deteriorates.
 *
 * Factors affecting position health include yield discrepancies (APY) between the vault and osETH, which can result
 * from:
 * - Differences in fee structures.
 * - Variations in attestation performance.
 * - The ratio of unbounded ETH to the vault's total value locked (TVL).
 * - Delays in validator activation on the Beacon Chain.
 * - Losses due to maximal extractable value (MEV) strategies.
 *
 * Risky positions may enter redemption processes, while positions deemed unhealthy are subject to liquidation.
 *
 * @see [Stakewise documentation](https://docs.stakewise.io/protocol-overview-in-depth/oseth#position-health) for more details
 */

export enum OsTokenPositionHealth {
    /** minted osETH <= 90% of staked ETH. */
    Healthy,
    /** minted osETH > 90% and <= 91% of staked ETH. */
    Moderate,
    /** minted osETH > 91% and <= 92% of staked ETH. */
    Risky,
    /** minted osETH > 92% of staked ETH. */
    Unhealthy,
}
