export interface BaseUnstakeQueueItem {
    exitQueueIndex?: bigint;
    positionTicket: bigint;
    when: Date;
    isWithdrawable: boolean;
    totalShares: bigint;
    totalAssets: bigint;
    leftShares: bigint;
    leftAssets: bigint;
    withdrawableShares: bigint;
    withdrawableAssets: bigint;
}

export interface NonWithdrawableUnstakeQueueItem extends BaseUnstakeQueueItem {
    isWithdrawable: false;
    withdrawableShares: 0n;
    withdrawableAssets: 0n;
}

export interface WithdrawableUnstakeQueueItem extends BaseUnstakeQueueItem {
    isWithdrawable: true;
    exitQueueIndex: bigint;
}

export type UnstakeQueueItem = NonWithdrawableUnstakeQueueItem | WithdrawableUnstakeQueueItem;
