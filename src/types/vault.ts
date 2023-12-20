import { Hex } from "viem";

/**
 * Provides details in regards to given Vault in the system
 */
export interface VaultDetails {
    /**
     * @const Address of Vault to use
     */
    address: Hex;
    /**
     * @const A human-readable string identifier of a Vault
     */
    name: string;
    /**
     * @const Vault description, as set by Chorus One
     */
    description: string;
    /**
     * @const Vault logotype that can be shown in UI
     */
    logoUrl: string;
    /**
     * @const Total value of assets locked in Gwei
     */
    tvl: bigint;
    /**
     * @const Average yield percentage in given Vault derived from historical data
     */
    apy: number;
    /**
     * @const Current balance of connected address in a given Vault
     */
    balance: bigint;
}
