import { Hex } from 'viem';

/**
 * A transaction for minting osTokens
 */
export interface BurnTransactionData {
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
