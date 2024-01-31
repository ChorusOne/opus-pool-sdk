import { Hex } from 'viem';

/**
 * A transaction for staking ETH
 * @typedef {Object} StakeTransactionData
 * @property {Hex} transaction - Hex-encoded transaction call data
 * @property {bigint} gasEstimation - Gas estimation
 * @property {bigint} amount - Amount of the ETH staked or unstaked
 * @property {bigint} maxPriorityFeePerGas - Max priority fee per gas to use for network
 * @property {bigint} maxFeePerGas - Max fee per gas to use for network
 */
export interface StakeTransactionData {
    /**
     * @const Hex-encoded transaction call data
     */
    transaction: Hex;

    /**
     * @const Gas estimation
     */
    gasEstimation: bigint;

    /**
     * @const Amount of the ETH staked or unstaked
     */
    amount: bigint;

    /**
     * @const Max priority fee per gas to use for network
     */
    maxPriorityFeePerGas: bigint;

    /**
     * @const Max fee per gas to use for network
     */
    maxFeePerGas: bigint;
}
