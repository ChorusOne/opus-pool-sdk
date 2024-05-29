import { Hex } from 'viem';
import { VaultActionType } from './enums';

/**
 * Represents a transaction history data point for a vault.
 */
export interface VaultTransaction {
    /**
     * The address of the vault that was interacted with.
     */
    vault: Hex;
    /**
     * The date and time when the vault transaction occurred.
     */
    when: Date;
    /**
     * The type of vault transaction.
     */
    type: VaultActionType;
    /**
     * The amount of ETH transacted, denominated in wei.
     */
    amount: bigint;
    /**
     * The hash of the transaction.
     */
    hash: string;
}
