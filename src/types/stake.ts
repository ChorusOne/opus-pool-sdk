import { Hex } from 'viem';
import { StakingTypeEnum } from './enums';

/**
 * A transaction for either stake or unstake
 */
export interface StakingTransactionData {
    /**
     * @const "Stake" or "Unstake" or "Mint"
     */
    type: StakingTypeEnum;

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
    amount?: bigint;

    /**
     * @const Referrer who was responsible for the deposit action
     */
    referrer?: Hex;

    /**
     * @const Max priority fee per gas to use for network
     */
    maxPriorityFeePerGas: bigint;

    /**
     * @const Max fee per gas to use for network
     */
    maxFeePerGas: bigint;
}
