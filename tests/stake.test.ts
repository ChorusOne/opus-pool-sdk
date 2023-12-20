import { ethers, viem } from 'hardhat';
import VaultAbi from '../src/internal/contracts/abi/VaultAbi.json';
import { OpusPool } from '../src';
import { Networks } from '../src/types/enums';
import { Hex, PublicClient, WalletClient, parseEther } from 'viem';
import { expect, test, beforeAll } from '@jest/globals';
import { hardhat } from 'viem/chains';
import { mine } from '@nomicfoundation/hardhat-toolbox/network-helpers';

const VAULT_ADDRESS: Hex = '0xd68AF28AeE9536144d4B9B6C0904CAf7E794B3D3';
const AMOUNT_TO_STAKE = parseEther('2');

describe('Staking Integration Test', () => {
    let USER_ADDRESS: Hex;
    let USER_ADDRESS_NOT_ENOUGH_BALANCE: Hex;
    let vaultContract: any;
    let walletClientWithBalance: WalletClient;
    let walletClientNoBalance: WalletClient;
    let publicClient: PublicClient;
    beforeAll(async () => {
        const [userWithBalance, userNoBalance] = await viem.getWalletClients();
        walletClientWithBalance = userWithBalance;
        walletClientNoBalance = userNoBalance;
        USER_ADDRESS = userWithBalance.account.address;
        USER_ADDRESS_NOT_ENOUGH_BALANCE = userNoBalance.account.address;
        publicClient = await viem.getPublicClient();
        vaultContract = await ethers.getContractAt(VaultAbi, VAULT_ADDRESS);
    }, 100_000);
    test('User can stake if there is enough balance', async () => {
        const pool = new OpusPool({
            address: USER_ADDRESS,
            network: Networks.Hardhat,
        });

        const userSharesInitial: bigint = await vaultContract.getShares(USER_ADDRESS);
        const initialBalance: bigint = await publicClient.getBalance({
            address: USER_ADDRESS,
        });
        expect(initialBalance).toBeGreaterThan(AMOUNT_TO_STAKE);

        const stakeTransactionData = await pool.buildStakeTransaction({
            vault: VAULT_ADDRESS,
            amount: AMOUNT_TO_STAKE,
        });
        const txHash = await walletClientWithBalance.sendTransaction({
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
        const receipt = await publicClient.waitForTransactionReceipt({ hash: txHash });
        expect(receipt.status).toEqual('success');
        const userSharesFinal: bigint = await vaultContract.getShares(USER_ADDRESS);
        expect(userSharesFinal).toEqual(userSharesInitial + AMOUNT_TO_STAKE);
    });
    test('Tx is reverted if there is not enough balance', async () => {
        const pool = new OpusPool({
            address: USER_ADDRESS_NOT_ENOUGH_BALANCE,
            network: Networks.Holesky,
        });
        const initialBalance: bigint = await publicClient.getBalance({
            address: USER_ADDRESS,
        });
        let hasFailed: boolean = false;
        await pool
            .buildStakeTransaction({
                vault: VAULT_ADDRESS,
                amount: initialBalance + AMOUNT_TO_STAKE,
            })
            .catch(async (e) => {
                expect(e.message).toContain(
                    'The total cost (gas * gas fee + value) of executing this transaction exceeds the balance of the account.',
                );
                hasFailed = true;
            });
        expect(hasFailed).toBe(true);
    });

    test('User with overridden referrer can stake if there is enough balance', async () => {
        const pool = new OpusPool({
            address: USER_ADDRESS,
            network: Networks.Hardhat,
        });

        const userSharesInitial: bigint = await vaultContract.getShares(USER_ADDRESS);
        const initialBalance: bigint = await publicClient.getBalance({
            address: USER_ADDRESS,
        });
        expect(initialBalance).toBeGreaterThan(AMOUNT_TO_STAKE);

        const stakeTransactionData = await pool.buildStakeTransaction({
            vault: VAULT_ADDRESS,
            amount: AMOUNT_TO_STAKE,
            referrer: "0x4242424242424242424242424242424242424242",
        });
        const txHash = await walletClientWithBalance.sendTransaction({
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
        const receipt = await publicClient.waitForTransactionReceipt({ hash: txHash });
        expect(receipt.status).toEqual('success');
        const userSharesFinal: bigint = await vaultContract.getShares(USER_ADDRESS);
        expect(userSharesFinal).toEqual(userSharesInitial + AMOUNT_TO_STAKE);
    });
});
