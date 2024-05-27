import { Hex } from 'viem';
import type { VaultDetails } from './types/vault';
import type { VaultTransaction } from './types/transaction';
import type { RewardsDataPoint } from './types/rewards';
import { Networks, OsTokenPositionHealth } from './types/enums';
import vaultDetails from './api/vaultDetails';
import { StakewiseConnector } from './internal/connector';
import transactionsHistory from './api/transactionsHistory';
import rewardsHistory from './api/rewardsHistory';
import burn from './api/burn';
import stake from './api/stake';
import unstake from './api/unstake';
import { getDefaultVaults } from './internal/defaultVaults';
import { mintOsToken } from './api/mintOsToken';
import {
    getHealthFactor,
    getMaxMint,
    getMaxWithdraw,
    getOsTokenPosition,
    getStakeBalance,
} from './internal/osTokenRequests';
import { getUnstakeQueue } from './api/getUnstakeQueue';
import { OsTokenPositionReturnType, StakeBalanceReturnType } from './types/osTokenRequests';
import { MintTransactionData } from './types/mint';
import { UnstakeTransactionData } from './types/unstake';
import { StakeTransactionData } from './types/stake';
import { BurnTransactionData } from './types/burn';
import withdrawUnstaked from './api/withdrawUnstaked';
import { UnstakeQueueItem, UnstakeQueueTransactionData } from './types/unstakeQueue';

export {
    getDefaultVaults,
    BurnTransactionData,
    MintTransactionData,
    Networks,
    OsTokenPositionHealth,
    RewardsDataPoint,
    StakeTransactionData,
    UnstakeTransactionData,
    VaultDetails,
    UnstakeQueueTransactionData,
    VaultTransaction,
    UnstakeQueueItem,
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
     * @param params.amount - Amount of Eth to deposit, denominated in wei
     * @param params.referrer - Address of the referrer. Optional.
     * 
     * @returns {StakeTransactionData} - `StakeTransactionData` 
     * @returns {Hex} - `StakeTransactionData.transaction` - Transaction to sign and broadcast
     * @returns {bigint} - `StakeTransactionData.amount` - Amount of Eth to deposit, denominated in wei
     * @returns {bigint} - `StakeTransactionData.gasEstimation` - Gas estimation in wei
     * @returns {bigint} - `StakeTransactionData.maxPriorityFeePerGas` - Max priority fee per gas to use for network
     * @returns {bigint} - `StakeTransactionData.maxFeePerGas` - Max fee per gas to use for network
     
     */
    async buildStakeTransaction(params: Parameters<typeof stake>[1]): Promise<StakeTransactionData> {
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
     * @param params.amount - Amount of Eth to deposit, denominated in wei
     * @returns `UnstakeTransactionData` for transaction to sign and broadcast
     */
    async buildUnstakeTransaction(params: Parameters<typeof unstake>[1]): Promise<UnstakeTransactionData> {
        return unstake(this, params);
    }

    /**
     * Retrieves the unstake queue for the vault, including the user's position in the queue and shares waiting to be unstaked
     *
     * @param vault - A vault address
     *
     * @returns {UnstakeQueueItem[]} Array of `UnstakeQueueItem` objects corresponding to the queue, which are needed to withdraw from the queue
     */
    async getUnstakeQueueForVault(vault: Hex): Promise<Array<UnstakeQueueItem>> {
        return getUnstakeQueue(this, vault);
    }

    /**
     * Generates transaction to withdraw from the unstake queue.
     *
     * Integrations should utilize wallet interface of their own choosing to
     * broadcast the transaction via RPC nodes of their preference. This method
     * is stateless and only generates transaction bytes, leaving sign and broadcast
     * up to the code integrating SDK.
     *
     * @param params - params for request
     * @param params.vault - A vault address
     * @param params.queueItems - Array of `UnstakeQueueItem` objects corresponding to the queue(see `getUnstakeQueueForVault`)
     * @returns `UnstakeQueueTransactionData` for transaction to sign and broadcast
     */

    async buildWithdrawUnstakedTransaction(params: {
        vault: Hex;
        queueItems: UnstakeQueueItem[];
    }): Promise<UnstakeQueueTransactionData> {
        return withdrawUnstaked(this, params.vault, params.queueItems);
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

    /**
     * Generates mint transaction to mint osTokens from chosen Vault.
     *
     * @param params - params for request
     * @param params.shares - Amount of osTokens to mint
     * @param params.vault - A vault address
     * @param params.referrer - Address of the referrer. Optional.
     * @returns `MintTransactionData` for transaction to sign and broadcast
     */
    async buildMintTransaction(params: Parameters<typeof mintOsToken>[1]): Promise<MintTransactionData> {
        return mintOsToken(this, params);
    }

    /**
     * Retrieves maximum amount of osTokens that can be minted by the user
     *
     * @param vault - A vault address
     * @returns Max amount of osTokens that can be minted
     */
    async getMaxMintForVault(vault: Hex): Promise<bigint> {
        return getMaxMint(this, vault);
    }

    /**
     * Retrieves health factor for the user
     *
     * @param mintedAssets - Amount of osTokens minted by the user
     * @param stakedAssets - Amount of ETH staked by the user
     * @returns Position Health (enum)
     */
    async getHealthFactorForUser(mintedAssets: bigint, stakedAssets: bigint): Promise<OsTokenPositionHealth> {
        return getHealthFactor(this, mintedAssets, stakedAssets);
    }

    /**
     * Retrieves stake balance for user in the vault
     *
     * @param vault - A vault address

     * @returns {StakeBalanceReturnType} 
     * @returns {bigint} - `StakeBalanceReturnType.assets` - Balance in ETH
     * @returns {bigint} - `StakeBalanceReturnType.shares` - Balance in vault tokens
     */
    async getStakeBalanceForUser(vault: Hex): Promise<StakeBalanceReturnType> {
        return getStakeBalance(this, vault);
    }

    /**
     * Retrieves osToken position for the vault
     *
     * @param vault - A vault address
     * @returns {OsTokenPositionReturnType}
     * @returns {object} - `OsTokenPositionReturnType.minted`
     * @returns {bigint} - `OsTokenPositionReturnType.minted.assets` - Balance in ETH
     * @returns {bigint} - `OsTokenPositionReturnType.minted.shares` - Balance
     * @returns {bigint} - `OsTokenPositionReturnType.minted.fee` - Usage fee amount
     * @returns {bigint} - `OsTokenPositionReturnType.health` - Position Health (enum)
     * @returns {bigint} - `OsTokenPositionReturnType.protocolFeePercent` - Usage fee percent
     */

    async getOsTokenPositionForVault(vault: Hex): Promise<OsTokenPositionReturnType> {
        return getOsTokenPosition(this, vault);
    }

    /**
     * Retrieves the max amount of ETH that can be unstaked
     * @param vault - A vault address
     * @returns Max amount of ETH that can be unstaked
     */

    async getMaxUnstakeForUserForVault(vault: Hex): Promise<bigint> {
        return getMaxWithdraw(this, vault);
    }

    /**
     * Generates burn transaction to burn osTokens from chosen Vault.
     *
     * @param params - params for request
     * @param params.shares - Amount of osTokens to burn
     * @param params.vault - A vault address
     * @returns `BurnTransactionData` for transaction to sign and broadcast
     */
    async buildBurnTransaction(params: Parameters<typeof burn>[1]): Promise<BurnTransactionData> {
        return burn(this, params);
    }
}
