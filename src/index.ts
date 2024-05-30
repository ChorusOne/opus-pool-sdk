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
 *
 * @see [Opus Pool SDK Documentation](https://chorus-one.gitbook.io/opus-pool-sdk-1.0/)
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
     * @param params.rpcUrl - (Optional) An RPC URL to interact with. If not provided, a default public node will be used
     *
     * @returns An instance of OpusPool
     *
     * @see [Installation](https://chorus-one.gitbook.io/opus-pool-sdk-1.0/build-your-staking-dapp/1-installation-and-setup#installation) for more information
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
     *
     * @see [Fetching Vault Details](https://chorus-one.gitbook.io/opus-pool-sdk-1.0/build-your-staking-dapp/2-fetching-vault-details) for more information
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
     *
     * @see [Transaction History](https://chorus-one.gitbook.io/opus-pool-sdk-1.0/build-your-staking-dapp/7-transaction-history) for more information
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
     * @param params.referrer - (Optional) The address of the referrer. This is used for tracking the source of the transaction
     *
     * @returns A promise that resolves to a transaction data object
     *
     * @see [Staking](https://chorus-one.gitbook.io/opus-pool-sdk-1.0/build-your-staking-dapp/3-staking) for more information
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
     *
     * @see [Unstaking](https://chorus-one.gitbook.io/opus-pool-sdk-1.0/build-your-staking-dapp/4-unstaking) for more information
     */
    async buildUnstakeTransaction(params: Parameters<typeof unstake>[1]): Promise<UnstakeTransactionData> {
        return unstake(this, params);
    }

    /**
     * Retrieves the unstake queue for a vault, including the user's position in the queue and shares waiting to be unstaked
     *
     * After initiating an unstake request using the `buildUnstakeTransaction` method, assets are placed into an unstake
     * queue.
     *
     * The `getUnstakeQueueForVault` method allows users to query the queue to check the current state of their unstake
     * requests, including their position in the queue, the amount of shares that are pending unstaking, the date and
     * time of the request, and whether the assets are withdrawable.
     *
     * To prepare the transaction for withdrawing these assets, use the `buildWithdrawUnstakedTransaction` method.
     *
     * @param vault - A vault address
     *
     * @returns A promise that resolves to an array of queue items
     *
     * @see [Fetching the Unstake Queue](https://chorus-one.gitbook.io/opus-pool-sdk-1.0/build-your-staking-dapp/4-unstaking#fetching-the-unstake-queue) for more information
     */
    async getUnstakeQueueForVault(vault: Hex): Promise<Array<UnstakeQueueItem>> {
        return getUnstakeQueue(this, vault);
    }

    /**
     * Generates transaction data to withdraw from the unstake queue
     *
     * This method is the final step in the unstaking process. Once assets in the unstake
     * queue have reached a withdrawable state (as determined by the `getUnstakeQueueForVault` method),
     * the `buildWithdrawUnstakedTransaction` method prepares the transaction data necessary
     * for transferring these assets back into the user's wallet.
     *
     * The unstake transaction effectively moves the user's assets into an unstake queue where they remain until they
     * become eligible for withdrawal. This queue is a safeguard mechanism that ensures the liquidity and stability of
     * the vault by managing the flow of assets. To check the status of these assets, use the `getUnstakeQueueForVault`
     * method.
     *
     * @remarks
     * Integrations should use their preferred wallet interface to broadcast the transaction via RPC nodes of their
     * choice. This method is stateless and only generates transaction bytes, leaving the signing and broadcasting up to
     * the code integrating the SDK
     *
     * @param params - Parameters for building the transaction
     * @param params.vault - A vault address
     * @param params.queueItems - An array of queue items to withdraw (see `getUnstakeQueueForVault`)
     *
     * @returns A promise that resolves to a transaction data object
     *
     * @see [Unstaking](https://chorus-one.gitbook.io/opus-pool-sdk-1.0/build-your-staking-dapp/4-unstaking) for more information
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
     *
     * @see [Rewards History](https://chorus-one.gitbook.io/opus-pool-sdk-1.0/build-your-staking-dapp/8-rewards-history) for more information
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
     * @param params.referrer - (Optional) The address of the referrer. This is used for tracking the source of the transaction
     *
     * @returns A promise that resolves to a transaction data object
     *
     * @see [Minting osETH](https://chorus-one.gitbook.io/opus-pool-sdk-1.0/build-your-staking-dapp/5-minting-os-eth) for more information
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
     *
     * @see [Checking Minting Limits](https://chorus-one.gitbook.io/opus-pool-sdk-1.0/build-your-staking-dapp/5-minting-os-eth#checking-minting-limits) for more information
     */
    async getMaxMintForVault(vault: Hex): Promise<bigint> {
        return getMaxMint(this, vault);
    }

    /**
     * Retrieves the vault position health for the user
     *
     * Position health tracks the value of osETH minted relative to the user's staked ETH in the vault.
     * Healthy positions have well-collateralized osETH. Factors affecting position health include
     * yield discrepancies, fee structures, attestation performance, and validator activation delays.
     *
     * Risky positions may enter redemption processes, while unhealthy positions are subject to
     * liquidation. This method calculates the health based on the minted osTokens (osETH) and the
     * staked ETH, helping users manage their staking strategy and mitigate risks.
     *
     * @param mintedAssets - Amount of osTokens minted by the user
     * @param stakedAssets - Amount of ETH staked by the user
     *
     * @returns A promise that resolves to the position health
     *
     * @see [Calculating Health Factor for Minting](https://chorus-one.gitbook.io/opus-pool-sdk-1.0/build-your-staking-dapp/5-minting-os-eth#calculating-health-factor-for-minting) for more information
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
     *
     * @see [Calculating Health Factor for Minting](https://chorus-one.gitbook.io/opus-pool-sdk-1.0/build-your-staking-dapp/5-minting-os-eth#calculating-health-factor-for-minting) for more information
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
     *
     * @see [Calculating Health Factor for Minting](https://chorus-one.gitbook.io/opus-pool-sdk-1.0/build-your-staking-dapp/5-minting-os-eth#calculating-health-factor-for-minting) for more information
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
     * @see [Determining Unstaking Limits](https://chorus-one.gitbook.io/opus-pool-sdk-1.0/build-your-staking-dapp/4-unstaking#determining-unstaking-limits) for more information
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
     *
     * @see [Burning osETH](https://chorus-one.gitbook.io/opus-pool-sdk-1.0/build-your-staking-dapp/6-burning-os-eth) for more information
     */
    async buildBurnTransaction(params: Parameters<typeof burn>[1]): Promise<BurnTransactionData> {
        return burn(this, params);
    }
}
