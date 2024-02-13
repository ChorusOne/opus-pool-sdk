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

const VAULT_ADDRESS: Hex = '0x95d0db03d59658e1af0d977ecfe142f178930ac5';
const AMOUNT_TO_STAKE = parseEther('20');
const AMOUNT_TO_MINT = parseEther('15');

const originalFetch = global.fetch;
let callCount = 0; // Track the number of calls to the specific URL

// on first call, there are no minted shares (shares: 0)
// make the second call after minting AMOUNT_TO_MINT shares (shares: minted_amount)
// make the third call after burning all shares (shares: minted_amount - burned_amount)
const mockFetch = jest.fn().mockImplementation((input, init) => {
    if (input === 'https://holesky-graph.stakewise.io/subgraphs/name/stakewise/stakewise?opName=OsTokenPositions') {
        callCount += 1; // Increment call count for the specific URL
        switch (callCount) {
            case 1:
                return Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve({ data: { osTokenPositions: [{ shares: '0' }] } }),
                });
            case 2:
                return Promise.resolve({
                    ok: true,
                    json: () =>
                        Promise.resolve({ data: { osTokenPositions: [{ shares: AMOUNT_TO_MINT.toString() }] } }),
                });
            default:
                return Promise.resolve({
                    ok: true,
                    json: () =>
                        Promise.resolve({
                            data: { osTokenPositions: [{ shares: '0' }] },
                        }),
                });
        }
    } else {
        return originalFetch(input, init); // Fallback to the original fetch for other URLs
    }
});

global.fetch = mockFetch;

describe('Burning OsToken', () => {
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
    test('should burn OsToken - happy path', async () => {
        const pool = new OpusPool({
            address: USER_ADDRESS,
            network: Networks.Hardhat,
        });

        // 1. stake
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

        const ostokenPositionInitial = await pool.getOsTokenPositionForVault(VAULT_ADDRESS);
        const maxBurnBeforeMinting = ostokenPositionInitial.minted.shares - ostokenPositionInitial.minted.fee;
        expect(maxBurnBeforeMinting).toEqual(0n);

        // 2. mint
        expect(AMOUNT_TO_MINT).toBeLessThanOrEqual(AMOUNT_TO_STAKE);

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
        const osTokenPositionAfterMinting = await pool.getOsTokenPositionForVault(VAULT_ADDRESS);
        expect(osTokenPositionAfterMinting.minted.shares - osTokenPositionAfterMinting.minted.fee).toEqual(
            AMOUNT_TO_MINT,
        );

        // 3. burn
        const maxBurnAfterMinting = osTokenPositionAfterMinting.minted.shares - osTokenPositionAfterMinting.minted.fee;
        const burnTransactionData = await pool.buildBurnTransaction({
            vault: VAULT_ADDRESS,
            shares: maxBurnAfterMinting,
        });
        const burnTx = await client.sendTransaction({
            account,
            to: VAULT_ADDRESS,
            data: burnTransactionData.transaction,
            type: 'eip1559',
            gas: burnTransactionData.gasEstimation,
            maxPriorityFeePerGas: burnTransactionData.maxPriorityFeePerGas,
            maxFeePerGas: burnTransactionData.maxFeePerGas,
            chain: hardhat,
        });
        await mine(10);
        const burnReceipt = await publicClient.getTransactionReceipt({ hash: burnTx });
        expect(burnReceipt.status).toEqual('success');
        const osTokenPositionAfterBurning = await pool.getOsTokenPositionForVault(VAULT_ADDRESS);
        const maxBurnAfterBurning = osTokenPositionAfterBurning.minted.shares - osTokenPositionAfterBurning.minted.fee;
        expect(maxBurnAfterBurning).toEqual(0n);
    }, 100_000);
});
