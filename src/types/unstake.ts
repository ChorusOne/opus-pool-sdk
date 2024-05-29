import { Hex } from 'viem';

/**
 * A transaction for unstaking ETH
 */
export interface UnstakeTransactionData {
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
