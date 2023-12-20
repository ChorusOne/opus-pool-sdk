import { ethers, viem } from 'hardhat';
import VaultAbi from '../src/internal/contracts/abi/VaultAbi.json';
import { OpusPool } from '../src';
import { Networks } from '../src/types/enums';
import { Hex, PublicClient, WalletClient, parseEther } from 'viem';
import { expect, test, beforeAll } from '@jest/globals';
import { hardhat } from 'viem/chains';
import { mine } from '@nomicfoundation/hardhat-toolbox/network-helpers';
import { Contract } from 'ethers';
import KeeperAbi from '../src/internal/contracts/abi/KeeperAbi.json';
import { VaultABI } from '../src/internal/contracts/vaultAbi';

const VAULT_ADDRESS: Hex = '0xd68AF28AeE9536144d4B9B6C0904CAf7E794B3D3';
const AMOUNT_TO_STAKE = parseEther('5');
const AMOUNT_TO_UNSTAKE = parseEther('4');
const AMOUNT_TO_UNSTAKE_TOO_MUCH = parseEther('500');

describe('Unstaking Integration Test', () => {
    let USER_ADDRESS: Hex;
    let vaultContract: Contract;
    let keeperContract: Contract;
    let walletClientWithBalance: WalletClient;
    let publicClient: PublicClient;
    beforeAll(async () => {
        const [userWithBalance] = await viem.getWalletClients();
        walletClientWithBalance = userWithBalance;
        USER_ADDRESS = userWithBalance.account.address;
        publicClient = await viem.getPublicClient();
        vaultContract = await ethers.getContractAt(VaultAbi, VAULT_ADDRESS);
        keeperContract = await ethers.getContractAt(KeeperAbi, '0xB580799Bf7d62721D1a523f0FDF2f5Ed7BA4e259');
    }, 100_000);
    test('User can unstake if there are enough shares', async () => {
        const pool = new OpusPool({
            address: USER_ADDRESS,
            network: Networks.Hardhat,
        });

        const userSharesInitial: bigint = await vaultContract.getShares(USER_ADDRESS);

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
        const stakeReceipt = await publicClient.waitForTransactionReceipt({ hash: stakeHash });
        expect(stakeReceipt.status).toEqual('success');
        const userSharesAfterStake: bigint = await vaultContract.getShares(USER_ADDRESS);
        expect(userSharesAfterStake).toEqual(userSharesInitial + AMOUNT_TO_STAKE);

        // then unstake
        const unstakeTransactionData = await pool.buildUnstakeTransaction({
            vault: VAULT_ADDRESS,
            amount: AMOUNT_TO_UNSTAKE,
        });

        const unstakeHash = await walletClientWithBalance.sendTransaction({
            account: USER_ADDRESS,
            to: VAULT_ADDRESS,
            data: unstakeTransactionData.transaction,
            value: unstakeTransactionData.amount,
            type: 'eip1559',
            gas: unstakeTransactionData.gasEstimation,
            maxPriorityFeePerGas: unstakeTransactionData.maxPriorityFeePerGas,
            maxFeePerGas: unstakeTransactionData.maxFeePerGas,
            chain: hardhat,
        });

        await mine(10);
        const unstakeReceipt = await publicClient.waitForTransactionReceipt({ hash: unstakeHash });
        expect(unstakeReceipt.status).toEqual('success');
        const userSharesFinal: bigint = await vaultContract.getShares(USER_ADDRESS);

        expect(userSharesFinal).toEqual(userSharesInitial + AMOUNT_TO_STAKE - AMOUNT_TO_UNSTAKE);
        const assets: bigint = await pool.connector.eth.readContract({
            abi: VaultABI,
            address: VAULT_ADDRESS,
            functionName: 'convertToAssets',
            args: [userSharesFinal],
        });
        expect(assets).toEqual(AMOUNT_TO_STAKE - AMOUNT_TO_UNSTAKE);
    });

    test('User can not unstake if there are not enough shares', async () => {
        const pool = new OpusPool({
            address: USER_ADDRESS,
            network: Networks.Hardhat,
        });
        const userSharesInitial: bigint = await vaultContract.getShares(USER_ADDRESS);

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
        const stakeReceipt = await publicClient.waitForTransactionReceipt({ hash: stakeHash });
        expect(stakeReceipt.status).toEqual('success');
        const userSharesAfterStake: bigint = await vaultContract.getShares(USER_ADDRESS);
        expect(userSharesAfterStake).toEqual(userSharesInitial + AMOUNT_TO_STAKE);

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
                value: unstakeTransactionData.amount,
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
