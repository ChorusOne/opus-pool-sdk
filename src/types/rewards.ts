import { Hex } from 'viem';

/**
 * Single atomic rewards point for a particular date
 */
export interface RewardsDataPoint {
    /**
     * @const A reference date for the rewards received
     */
    when: Date;
    /**
     * @const Amount of rewards received in wei
     */
    amount: bigint;
    /**
     * @const Address of the vault that generated the rewards
     */
    vault: Hex;
}
