import { Hex } from 'viem';
import { VaultActionType } from './enums';

/**
 * Transaction history data point
 */
export interface VaultTransaction {
    /**
     *  @const Opus Vault that have been interacted with
     */
    vault: Hex;
    /**
     * @const Date and time of vault transaction
     */
    when: Date;
    /**
     * @const Type of vault transaction
     */
    type: VaultActionType;
    /**
     * @const Amount of Eth transacted, denominated in gwei
     */
    amount: bigint;
    /**
     * @const Hash of transaction
     */
    hash: string;
}
