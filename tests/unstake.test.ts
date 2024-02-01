import { OpusPool } from '../src';
import { Networks } from '../src/types/enums';
import {
    Hex,
    PrivateKeyAccount,
    PublicClient,
    WalletClient,
    createPublicClient,
    createWalletClient,
    http,
    parseEther,
} from 'viem';
import { expect, test, beforeAll } from '@jest/globals';
import { hardhat } from 'viem/chains';
import { mine } from '@nomicfoundation/hardhat-toolbox/network-helpers';
import { privateKeyToAccount } from 'viem/accounts';

const VAULT_ADDRESS: Hex = '0xd68AF28AeE9536144d4B9B6C0904CAf7E794B3D3';
const AMOUNT_TO_STAKE = parseEther('5');
const AMOUNT_TO_UNSTAKE = parseEther('4');
const AMOUNT_TO_UNSTAKE_TOO_MUCH = parseEther('500');

describe('Unstaking Integration Test', () => {
    let USER_ADDRESS: Hex;
    let walletClientWithBalance: WalletClient;
    let publicClient: PublicClient;
    let account: PrivateKeyAccount;
    beforeAll(() => {
        USER_ADDRESS = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266';
        account = privateKeyToAccount('0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80');
        walletClientWithBalance = createWalletClient({
            account,
            chain: hardhat,
            transport: http(),
        });
        publicClient = createPublicClient({
            chain: hardhat,
            transport: http(),
        });
    });
    test('User can unstake after staking successfully', async () => {
        const pool = new OpusPool({
            address: USER_ADDRESS,
            network: Networks.Hardhat,
        });

        const initialMaxWithdraw = await pool.getMaxUnstakeForUserForVault(VAULT_ADDRESS);
        const { assets: initialAssets } = await pool.getStakeBalanceForUser(VAULT_ADDRESS);

        // first stake
        const stakeTransactionData = await pool.buildStakeTransaction({
            vault: VAULT_ADDRESS,
            amount: AMOUNT_TO_STAKE,
        });
        const stakeHash = await walletClientWithBalance.sendTransaction({
            account: USER_ADDRESS,
            to: VAULT_ADDRESS,
            data: stakeTransactionData.transaction,
            value: stakeTransactionData.amount,
            type: 'eip1559',
            gas: stakeTransactionData.gasEstimation,
            maxPriorityFeePerGas: stakeTransactionData.maxPriorityFeePerGas,
            maxFeePerGas: stakeTransactionData.maxFeePerGas,
            chain: hardhat,
        });

        await mine(10);
        const stakeReceipt = await publicClient.getTransactionReceipt({ hash: stakeHash });
        expect(stakeReceipt.status).toEqual('success');

        const maxWithdrawAfterStake = await pool.getMaxUnstakeForUserForVault(VAULT_ADDRESS);
        expect(maxWithdrawAfterStake).toEqual(initialMaxWithdraw + AMOUNT_TO_STAKE);
        const { assets: assetsAfterStaking } = await pool.getStakeBalanceForUser(VAULT_ADDRESS);

        expect(assetsAfterStaking).toEqual(initialAssets + AMOUNT_TO_STAKE);

        // then unstake
        const unstakeTransactionData = await pool.buildUnstakeTransaction({
            vault: VAULT_ADDRESS,
            amount: AMOUNT_TO_UNSTAKE,
        });

        const unstakeHash = await walletClientWithBalance.sendTransaction({
            account: USER_ADDRESS,
            to: VAULT_ADDRESS,
            data: unstakeTransactionData.transaction,
            type: 'eip1559',
            gas: unstakeTransactionData.gasEstimation,
            maxPriorityFeePerGas: unstakeTransactionData.maxPriorityFeePerGas,
            maxFeePerGas: unstakeTransactionData.maxFeePerGas,
            chain: hardhat,
        });

        await mine(10);
        const unstakeReceipt = await publicClient.getTransactionReceipt({ hash: unstakeHash });
        expect(unstakeReceipt.status).toEqual('success');

        const { assets: assetsAfterUnstaking } = await pool.getStakeBalanceForUser(VAULT_ADDRESS);
        expect(assetsAfterUnstaking).toEqual(assetsAfterStaking - AMOUNT_TO_UNSTAKE);
    });

    test('User can not unstake if there are not enough assets', async () => {
        const pool = new OpusPool({
            address: USER_ADDRESS,
            network: Networks.Hardhat,
        });
        const { assets: initialAssets } = await pool.getStakeBalanceForUser(VAULT_ADDRESS);

        // first stake
        const stakeTransactionData = await pool.buildStakeTransaction({
            vault: VAULT_ADDRESS,
            amount: AMOUNT_TO_STAKE,
        });
        const stakeHash = await walletClientWithBalance.sendTransaction({
            account: USER_ADDRESS,
            to: VAULT_ADDRESS,
            data: stakeTransactionData.transaction,
            value: stakeTransactionData.amount,
            type: 'eip1559',
            gas: stakeTransactionData.gasEstimation,
            maxPriorityFeePerGas: stakeTransactionData.maxPriorityFeePerGas,
            maxFeePerGas: stakeTransactionData.maxFeePerGas,
            chain: hardhat,
        });

        await mine(10);
        const stakeReceipt = await publicClient.getTransactionReceipt({ hash: stakeHash });
        expect(stakeReceipt.status).toEqual('success');
        const { assets: assetsAfterStaking } = await await pool.getStakeBalanceForUser(VAULT_ADDRESS);
        expect(assetsAfterStaking).toEqual(initialAssets + AMOUNT_TO_STAKE);

        // then unstake
        const unstakeTransactionData = await pool.buildUnstakeTransaction({
            vault: VAULT_ADDRESS,
            amount: AMOUNT_TO_UNSTAKE_TOO_MUCH,
        });
        let hasFailed: boolean = false;
        await walletClientWithBalance
            .sendTransaction({
                account: USER_ADDRESS,
                to: VAULT_ADDRESS,
                data: unstakeTransactionData.transaction,
                type: 'eip1559',
                gas: unstakeTransactionData.gasEstimation,
                maxPriorityFeePerGas: unstakeTransactionData.maxPriorityFeePerGas,
                maxFeePerGas: unstakeTransactionData.maxFeePerGas,
                chain: hardhat,
            })
            .catch(async (e) => {
                expect(e.details).toContain(
                    // InsufficientAssets signature
                    '0x96d80433',
                );
                hasFailed = true;
            });
        expect(hasFailed).toBe(true);
    });
});
