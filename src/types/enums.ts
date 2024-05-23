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
 * - `Healthy`: value of minted osETH does not exceed 90% of the staked ETH value a staker has in the Vault.
 * - `Moderate`: value of minted osETH exceeds 90% of the staked ETH value a staker has in the Vault but remains below 91%.
 * - `Risky`: value of minted osETH exceeds 91% of the staked ETH value a staker has in the Vault but remains below 92%.
 * - `Unhealthy`: value of minted osETH exceeds 92% of the staked ETH value a staker has in the Vault.
 *
 * Please reffer to the official [documentation](https://docs.stakewise.io/protocol-overview-in-depth/oseth#position-health) for more details.
 */
export enum OsTokenPositionHealth {
    Healthy,
    Moderate,
    Risky,
    Unhealthy,
}
