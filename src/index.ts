import { Hex } from 'viem';
import type { VaultDetails } from './types/vault';
import type { VaultTransaction } from './types/transaction';
import type { RewardsDataPoint } from './types/rewards';
import { Networks, OsTokenPositionHealth, VaultActionType } from './types/enums';
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
    OsTokenPositionReturnType,
    RewardsDataPoint,
    StakeBalanceReturnType,
    StakeTransactionData,
    UnstakeQueueItem,
    UnstakeQueueTransactionData,
    UnstakeTransactionData,
    VaultActionType,
    VaultDetails,
    VaultTransaction,
};

/**
 * This class serves as the main entry point for the OPUS Pool SDK. It provides methods to interact with the Stakewise V3
 * vaults, leveraging Chorus One’s MEV research to enhance staking returns. It enables vault and token operations,
 * facilitating integration into Ethereum-based applications.
 */
export class OpusPool {
    /** Currently connected wallet address */
    userAccount: Hex;
    /** @ignore */
    connector: StakewiseConnector;

    /**
     * Creates an OpusPool instance
     *
     * @param params - Initialization parameters
     * @param params.address - An address of the currently connected user wallet. If the user connects to a different wallet,
     * OpusPool must be re-instantiated with a new user address
     * @param params.network - Network configuration (Networks.Ethereum or Networks.Holesky)
     * @param params.rpcUrl - An RPC URL to interact with. If not provided, a default public node will be used. Optional
     *
     * @returns An instance of OpusPool
     */
    constructor(params: { address: Hex; network: Networks; rpcUrl?: string }) {
        const network = params.network;
        this.connector = new StakewiseConnector(network, params.rpcUrl);
        this.userAccount = params.address;
    }

    /**
     * Provides information regarding vault details such as TVL, APY, description, logo, and the balance of the connected
     * customer in that vault
     *
     * @param vaults - An array of vault addresses to query the details for
     *
     * @returns A promise that resolves to an array of vault details corresponding to the given vaults
     */
    async getVaultDetails(vaults: Hex[]): Promise<VaultDetails[]> {
        return vaultDetails(this, vaults);
    }

    /**
     * Returns up to 1000 of the most recent transactions of the current user associated with the given vault
     *
     * @param vaults - An array of vault addresses to query the interactions for
     *
     * @returns A promise that resolves to an array of transactions corresponding to the given vaults
     */
    async getTransactionsHistory(vaults: Hex[]): Promise<VaultTransaction[]> {
        return transactionsHistory(this, vaults);
    }

    /**
     * Generates a stake transaction to deposit into the chosen vault
     *
     * @remarks
     * Integrations should use their preferred wallet interface to broadcast the transaction via RPC nodes of
     * their choice. This method is stateless and only generates transaction bytes, leaving the signing and broadcasting up to
     * the code integrating the SDK
     *
     * @param params - Parameters for building the transaction
     * @param params.vault - A vault address
     * @param params.amount - An amount of ETH to deposit, denominated in wei
     * @param params.referrer - An address of the referrer. Optional
     *
     * @returns A promise that resolves to a transaction data object
     */
    async buildStakeTransaction(params: Parameters<typeof stake>[1]): Promise<StakeTransactionData> {
        return stake(this, params);
    }

    /**
     * Generates unstake transaction data to withdraw from the chosen vault
     *
     * @remarks
     * Integrations should use their preferred wallet interface to broadcast the transaction via RPC nodes of
     * their choice. This method is stateless and only generates transaction bytes, leaving the signing and broadcasting up to
     * the code integrating the SDK
     *
     * @param params - Parameters for building the transaction
     * @param params.vault - A vault address
     * @param params.amount - An amount of ETH to unstake, denominated in wei
     *
     * @returns A promise that resolves to a transaction data object
     */
    async buildUnstakeTransaction(params: Parameters<typeof unstake>[1]): Promise<UnstakeTransactionData> {
        return unstake(this, params);
    }

    /**
     * Retrieves the unstake queue for a vault, including the user's position in the queue and shares waiting to be unstaked
     *
     * @param vault - A vault address
     *
     * @returns A promise that resolves to an array of queue items
     */
    async getUnstakeQueueForVault(vault: Hex): Promise<Array<UnstakeQueueItem>> {
        return getUnstakeQueue(this, vault);
    }

    /**
     * Generates transaction data to withdraw from the unstake queue
     *
     * @remarks
     * Integrations should use their preferred wallet interface to broadcast the transaction via RPC nodes of
     * their choice. This method is stateless and only generates transaction bytes, leaving the signing and broadcasting up to
     * the code integrating the SDK
     *
     * @param params - Parameters for building the transaction
     * @param params.vault - A vault address
     * @param params.queueItems - An array of queue items to withdraw (see `getUnstakeQueueForVault`)
     *
     * @returns A promise that resolves to a transaction data object
     */
    async buildWithdrawUnstakedTransaction(params: {
        vault: Hex;
        queueItems: UnstakeQueueItem[];
    }): Promise<UnstakeQueueTransactionData> {
        return withdrawUnstaked(this, params.vault, params.queueItems);
    }

    /**
     * Retrieves the vault rewards history for a given user
     *
     * @param params - Parameters for the rewards history query
     * @param params.vault - An address of the vault to retrieve rewards for
     * @param params.from - A starting date for the rewards retrieval query
     * @param params.to - An end date for the rewards retrieval query
     *
     * @returns An array of daily rewards amount data points
     */
    async getRewardsHistory(params: Parameters<typeof rewardsHistory>[1]): Promise<Array<RewardsDataPoint>> {
        return rewardsHistory(this, params);
    }

    /**
     * Generates a mint transaction to mint osTokens from the chosen vault
     *
     * @remarks
     * Integrations should use their preferred wallet interface to broadcast the transaction via RPC nodes of
     * their choice. This method is stateless and only generates transaction bytes, leaving the signing and broadcasting up to
     * the code integrating the SDK
     *
     * @param params - Parameters for building the transaction
     * @param params.shares - An amount of shares to be minted
     * @param params.vault - A vault address
     * @param params.referrer - An address of the referrer. Optional
     *
     * @returns A promise that resolves to a transaction data object
     */
    async buildMintTransaction(params: Parameters<typeof mintOsToken>[1]): Promise<MintTransactionData> {
        return mintOsToken(this, params);
    }

    /**
     * Retrieves the maximum amount of osTokens that can be minted by the user
     *
     * @param vault - A vault address
     *
     * @returns A promise that resolves to the max amount of osTokens that can be minted
     */
    async getMaxMintForVault(vault: Hex): Promise<bigint> {
        return getMaxMint(this, vault);
    }

    /**
     * Retrieves the vault position health for the user
     *
     * @param mintedAssets - Amount of osTokens minted by the user
     * @param stakedAssets - Amount of ETH staked by the user
     *
     * @returns A promise that resolves to the position health
     */
    async getHealthFactorForUser(mintedAssets: bigint, stakedAssets: bigint): Promise<OsTokenPositionHealth> {
        return getHealthFactor(this, mintedAssets, stakedAssets);
    }

    /**
     * Retrieves the stake balance for the user in the vault
     *
     * @param vault - A vault address
     *
     * @returns A promise that resolves to an object with the balance in ETH and the balance in vault tokens
     */
    async getStakeBalanceForUser(vault: Hex): Promise<StakeBalanceReturnType> {
        return getStakeBalance(this, vault);
    }

    /**
     * Retrieves the osToken position for the vault
     *
     * @param vault - A vault address
     *
     * @returns A promise that resolves to the osToken position data for the vault
     */
    async getOsTokenPositionForVault(vault: Hex): Promise<OsTokenPositionReturnType> {
        return getOsTokenPosition(this, vault);
    }

    /**
     * Retrieves the maximum amount of ETH that can be unstaked
     *
     * @param vault - A vault address
     *
     * @returns A promise that resolves to the max amount of ETH that can be unstaked
     */
    async getMaxUnstakeForUserForVault(vault: Hex): Promise<bigint> {
        return getMaxWithdraw(this, vault);
    }

    /**
     * Generates a burn transaction to burn osTokens from the chosen vault
     *
     * @remarks
     * Integrations should use their preferred wallet interface to broadcast the transaction via RPC nodes of
     * their choice. This method is stateless and only generates transaction bytes, leaving the signing and broadcasting up to
     * the code integrating the SDK
     *
     * @param params - Parameters for building the transaction
     * @param params.shares - An amount of shares to be burned
     * @param params.vault - A vault address
     *
     * @returns A promise that resolves to a transaction data object
     */
    async buildBurnTransaction(params: Parameters<typeof burn>[1]): Promise<BurnTransactionData> {
        return burn(this, params);
    }
}
