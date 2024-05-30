import { Hex } from 'viem';

/**
 * A transaction for burning osTokens
 */
export interface BurnTransactionData {
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
