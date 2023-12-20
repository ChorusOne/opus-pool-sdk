import { Hex } from 'viem';
import type { VaultDetails } from './types/vault';
import type { VaultTransaction } from './types/transaction';
import type { StakingTransactionData } from './types/stake';
import type { RewardsDataPoint } from './types/rewards';
import { Networks, StakingTypeEnum } from './types/enums';
import vaultDetails from './api/vaultDetails';
import { StakewiseConnector } from './internal/connector';
import transactionsHistory from './api/transactionsHistory';
import rewardsHistory from './api/rewardsHistory';
import stake from './api/stake';
import unstake from './api/unstake';
import { getDefaultVaults } from './internal/defaultVaults';

export {
    getDefaultVaults,
    Networks,
    StakingTypeEnum,
    VaultDetails,
    StakingTransactionData,
    VaultTransaction,
    RewardsDataPoint,
};

/**
 * Pooling solution
 */
export class OpusPool {
    /** Currently connected Ethereum address */
    userAccount: Hex;
    /** @ignore */
    connector: StakewiseConnector;

    /**
     * Instantiates pooling solution facade that provides convenience methods
     * to allow staking for individual user.
     *
     * @param params - Parameters to configure the pooling solution interface.
     * @param params.address - An address of currently connected user wallet.
     *                       If user connects different wallet, pooling solution implementation
     *                       must be re-instantiated with a new user address.
     * @param params.network - One of holesky, ethereum, hardhat
     * @param params.rpcUrl - RPC Url to interact with
     *   If not defined, either public node
     */
    constructor(params: { address: Hex; network: Networks; rpcUrl?: string }) {
        const network = params.network;
        this.connector = new StakewiseConnector(network, params.rpcUrl);
        this.userAccount = params.address;
    }

    /**
     * Exposes information regarding vault details such as TVL, APY, description and logotype,
     *  and also balance of connected customer in that Vault.
     *
     * @param vaults an array of vault addresses to query the details for
     * @returns An array of `OpusVaultDetails` corresponding to given details
     */
    async getVaultDetails(vaults: Hex[]): Promise<VaultDetails[]> {
        return vaultDetails(this, vaults);
    }

    /**
     * Returns up to 1000 Stake or Unstake interactions of current user with given Vault.
     *
     * @param vaults an array of vault addresses to query the interactions for
     * @returns An array of `OpusVaultDetails` corresponding to given details
     */
    async getTransactionsHistory(vaults: Hex[]): Promise<VaultTransaction[]> {
        return transactionsHistory(this, vaults);
    }

    /**
     * Generates stake transaction to deposit into chosen Vault
     *
     *  Integrations should utilize wallet interface of their own choosing to
     * broadcast the transaction via RPC nodes of their preference. This method
     * is stateless and only generates transaction bytes, leaving sign and broadcast
     * up to the code integrating SDK.
     *
     * @param params - params for request
     * @param params.vault - A vault address
     * @param params.amount - Amount of Eth to deposit, denominated in gwei
     * @returns `StakingTransactionData` for transaction to sign and broadcast
     */
    async buildStakeTransaction(params: Parameters<typeof stake>[1]): Promise<StakingTransactionData> {
        return stake(this, params);
    }

    /**
     * Generates unstake transaction to withdraw from chosen Vault.
     *
     * Integrations should utilize wallet interface of their own choosing to
     * broadcast the transaction via RPC nodes of their preference. This method
     * is stateless and only generates transaction bytes, leaving sign and broadcast
     * up to the code integrating SDK.
     *
     * @param params - params for request
     * @param params.vault - A vault address
     * @param params.amount - Amount of Eth to deposit, denominated in gwei
     * @returns `StakingTransactionData` for transaction to sign and broadcast
     */
    async buildUnstakeTransaction(params: Parameters<typeof unstake>[1]): Promise<StakingTransactionData> {
        return unstake(this, params);
    }

    /**
     * Retrieves rewards history for customer, earned via specific Vaults
     *
     * @param params - params for request
     * @param params.from - Starting date for the rewards retrieval query
     * @param params.to - End date for the rewards retrieval query
     * @param params.vault - Address of the vault to retrieve rewards for
     *
     * @returns Array of daily rewards amount data points
     */
    async getRewardsHistory(params: Parameters<typeof rewardsHistory>[1]): Promise<Array<RewardsDataPoint>> {
        return rewardsHistory(this, params);
    }
}
