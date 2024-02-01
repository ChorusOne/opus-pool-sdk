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
const AMOUNT_TO_STAKE = parseEther('2');

describe('Staking Integration Test', () => {
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
    test('User can stake if there is enough balance', async () => {
        const pool = new OpusPool({
            address: USER_ADDRESS,
            network: Networks.Hardhat,
        });

        const { assets: initialAssets } = await pool.getStakeBalanceForUser(VAULT_ADDRESS);
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
        const receipt = await publicClient.getTransactionReceipt({ hash: txHash });
        expect(receipt.status).toEqual('success');

        const { assets: assetsAfterStaking } = await pool.getStakeBalanceForUser(VAULT_ADDRESS);
        expect(assetsAfterStaking).toEqual(initialAssets + AMOUNT_TO_STAKE);
    });
    test('Tx is reverted if there is not enough balance', async () => {
        const pool = new OpusPool({
            address: USER_ADDRESS,
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

        const { assets: initialAssets } = await pool.getStakeBalanceForUser(VAULT_ADDRESS);
        const initialBalance: bigint = await publicClient.getBalance({
            address: USER_ADDRESS,
        });
        expect(initialBalance).toBeGreaterThan(AMOUNT_TO_STAKE);

        const stakeTransactionData = await pool.buildStakeTransaction({
            vault: VAULT_ADDRESS,
            amount: AMOUNT_TO_STAKE,
            referrer: '0x4242424242424242424242424242424242424242',
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

        const { assets: assetsAfterStaking } = await pool.getStakeBalanceForUser(VAULT_ADDRESS);
        expect(assetsAfterStaking).toEqual(initialAssets + AMOUNT_TO_STAKE);
    });
});
