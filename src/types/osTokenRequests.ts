import { OsTokenPositionHealth } from './enums';

export type OsTokenPositionReturnType = {
    minted: {
        assets: bigint;
        shares: bigint;
        fee: bigint;
    };
    health: OsTokenPositionHealth;
    protocolFeePercent: bigint;
};

export type OsTokenDataReturnType = {
    rate: string;
    ltvPercent: bigint;
    thresholdPercent: bigint;
};

export type StakeBalanceReturnType = {
    shares: bigint;
    assets: bigint;
};
