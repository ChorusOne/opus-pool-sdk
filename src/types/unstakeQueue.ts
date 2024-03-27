import { Hex } from 'viem';

/**
 * Unstake queue item. Used when retrieving the unstake queue or withdrawing from it.
 */
export interface UnstakeQueueItem {
    /**
     *  @const Index of the unstake queue item
     */
    exitQueueIndex?: bigint;
    /**
     * @const Unique identifier of the unstake queue item
     */
    positionTicket: bigint;
    /**
     * @const Date and time when the item was added to the queue
     */
    when: Date;
    /**
     * @const Shows if the asset is withdrawable
     */
    isWithdrawable: boolean;
    /**
     * @const Total amount of assets in shares
     */
    totalShares: bigint;
    /**
     * @const Total amount of assets in tokens
     */
    totalAssets: bigint;
    /**
     * @const Amount of assets in shares that cannot be withdrawn
     */
    leftShares: bigint;
    /**
     * @const Amount of assets in tokens that cannot be withdrawn
     */
    leftAssets: bigint;
    /**
     * @const Amount of assets in shares that can be withdrawn
     */
    withdrawableShares: bigint;
    /**
     * @const Amount of assets in tokens that can be withdrawn
     */
    withdrawableAssets: bigint;
}

/**
 * A transaction for unstaking from the queue
 */

// TODO: merge with the rest of transactions
export interface UnstakeQueueTransactionData {
    /**
     * @const Hex-encoded transaction call data
     */
    transaction: Hex;

    /**
     * @const Gas estimation
     */
    gasEstimation: bigint;

    /**
     * @const Max priority fee per gas to use for network
     */
    maxPriorityFeePerGas: bigint;

    /**
     * @const Max fee per gas to use for network
     */
    maxFeePerGas: bigint;
}
