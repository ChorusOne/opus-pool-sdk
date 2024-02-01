export enum Networks {
    Ethereum = 'ethereum',
    Holesky = 'holesky',
    /** @ignore */
    Hardhat = 'hardhat',
}
export enum VaultActionType {
    Redeemed = 'Redeemed',
    Migrated = 'Migrated',
    Deposited = 'Deposited',
    VaultCreated = 'VaultCreated',
    OsTokenMinted = 'OsTokenMinted',
    OsTokenBurned = 'OsTokenBurned',
    OsTokenRedeemed = 'OsTokenRedeemed',
    OsTokenLiquidated = 'OsTokenLiquidated',
    ExitedAssetsClaimed = 'ExitedAssetsClaimed',
}

/**
 * The position health will track the value of osETH minted by stakers relative to the value of their ETH stake in the Vault.
 * - `Unhealthy`: value of minted osETH exceeds 92% of the staked ETH value a staker has in the Vault.
 * - `Moderate`: value of minted osETH exceeds 90% of the staked ETH value a staker has in the Vault but remains below 91%.
 * - `Healthy`: value of minted osETH does not exceed 90% of the staked ETH value a staker has in the Vault.
 * - `Risky`: value of minted osETH exceeds 91% of the staked ETH value a staker has in the Vault but remains below 92%.
 *
 * Please reffer to the official [documentation](https://docs.stakewise.io/protocol-overview-in-depth/oseth#position-health) for more details.
 */
export enum OsTokenPositionHealth {
    Unhealthy,
    Moderate,
    Healthy,
    Risky,
}
