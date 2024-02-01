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
import { Networks } from '../src/types/enums';
import { OpusPool } from '../src';
import { hardhat } from 'viem/chains';
import { privateKeyToAccount } from 'viem/accounts';
import { mine } from '@nomicfoundation/hardhat-toolbox/network-helpers';
import { expect, test } from '@jest/globals';
import { VaultABI } from '../src/internal/contracts/vaultAbi';

const VAULT_ADDRESS: Hex = '0x95d0db03d59658e1af0d977ecfe142f178930ac5';
const AMOUNT_TO_STAKE = parseEther('20');
const AMOUNT_TO_MINT = parseEther('1');

describe('Minting OsToken', () => {
    let USER_ADDRESS: Hex;
    let publicClient: PublicClient;
    let client: WalletClient;
    let account: PrivateKeyAccount;
    beforeAll(() => {
        USER_ADDRESS = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266';
        account = privateKeyToAccount('0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80');
        client = createWalletClient({
            account,
            chain: hardhat,
            transport: http(),
        });
        publicClient = createPublicClient({
            chain: hardhat,
            transport: http(),
        });
    });
    test('should mint OsToken - happy path', async () => {
        const pool = new OpusPool({
            address: USER_ADDRESS,
            network: Networks.Hardhat,
        });

        const userSharesInitial = await publicClient.readContract({
            abi: VaultABI,
            address: VAULT_ADDRESS,
            functionName: 'getShares',
            args: [USER_ADDRESS],
        });

        // we stake first
        const stakeTransactionData = await pool.buildStakeTransaction({
            vault: VAULT_ADDRESS,
            amount: AMOUNT_TO_STAKE,
        });

        const stakeTxHash = await client.sendTransaction({
            account,
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
        const stakeReceipt = await publicClient.getTransactionReceipt({ hash: stakeTxHash });
        expect(stakeReceipt.status).toEqual('success');

        const stake = await pool.getStakeBalanceForUser(VAULT_ADDRESS);
        expect(stake.assets).toBeGreaterThan(userSharesInitial);

        const maxMint = await pool.getMaxMintForVault(VAULT_ADDRESS);

        expect(maxMint).toBeGreaterThan(0n);
        expect(maxMint).toBeGreaterThan(AMOUNT_TO_MINT);

        const mintTransactionData = await pool.buildMintTransaction({
            vault: VAULT_ADDRESS,
            shares: AMOUNT_TO_MINT,
        });

        const mintTxHash = await client.sendTransaction({
            account,
            to: VAULT_ADDRESS,
            data: mintTransactionData.transaction,
            type: 'eip1559',
            gas: mintTransactionData.gasEstimation,
            maxPriorityFeePerGas: mintTransactionData.maxPriorityFeePerGas,
            maxFeePerGas: mintTransactionData.maxFeePerGas,
            chain: hardhat,
        });

        await mine(10);
        const receipt = await publicClient.getTransactionReceipt({ hash: mintTxHash });
        expect(receipt.status).toEqual('success');
    }, 100_000);
});
