import { Hex } from 'viem';

/**
 * Represents an item in the unstake queue. Used for retrieving the unstake queue or withdrawing from it.
 */
export interface UnstakeQueueItem {
    /**
     * The index of the unstake queue item.
     */
    exitQueueIndex?: bigint;
    /**
     * The unique identifier of the unstake queue item.
     */
    positionTicket: bigint;
    /**
     * The date and time when the item was added to the queue.
     */
    when: Date;
    /**
     * Indicates whether the asset is withdrawable.
     */
    isWithdrawable: boolean;
    /**
     * The total amount of assets in shares.
     */
    totalShares: bigint;
    /**
     * The total amount of assets in ETH.
     */
    totalAssets: bigint;
    /**
     * The amount of assets in shares that cannot be withdrawn.
     */
    leftShares: bigint;
    /**
     * The amount of assets in ETH that cannot be withdrawn.
     */
    leftAssets: bigint;
    /**
     * The amount of assets in shares that can be withdrawn.
     */
    withdrawableShares: bigint;
    /**
     * The amount of assets in ETH that can be withdrawn.
     */
    withdrawableAssets: bigint;
}

// TODO: merge with the rest of transactions

/**
 * A transaction for claiming unstaked assets
 */
export interface UnstakeQueueTransactionData {
    /**
     * Hex-encoded transaction call data
     */
    transaction: Hex;

    /**
     * Gas estimation for the transaction.
     */
    gasEstimation: bigint;

    /**
     * Max priority fee per gas to use for the network.
     */
    maxPriorityFeePerGas: bigint;

    /**
     * Max fee per gas to use for the network.
     */
    maxFeePerGas: bigint;
}
