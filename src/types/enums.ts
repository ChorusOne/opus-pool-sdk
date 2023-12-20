export enum Networks {
    Ethereum = 'ethereum',
    Holesky = 'holesky',
    /** @ignore */
    Hardhat = 'hardhat',
}

export enum StakingTypeEnum {
    Stake = 'Stake',
    Unstake = 'Unstake',
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
