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

const originalFetch = global.fetch;

const day = 24 * 60 * 60;
const mockExitRequests = [
    {
        positionTicket: '104290864747044912540',
        totalShares: '9970426766148468',
        // Earlier than the first one
        timestamp: Math.round((new Date().getTime() - 60000) / 1000 - day * 2).toString(),
    },
    {
        positionTicket: '204300835173811063008',
        totalShares: '199704267661484684',
        timestamp: Math.round(new Date().getTime() / 1000 - day * 2).toString(),
    },
];
const mockFetch = jest.fn().mockImplementation((input, init) => {
    if (input === 'https://holesky-graph.stakewise.io/subgraphs/name/stakewise/stakewise?opName=exitQueue') {
        return Promise.resolve({
            ok: true,
            json: () =>
                Promise.resolve({
                    data: {
                        exitRequests: mockExitRequests,
                    },
                }),
        });
    } else {
        return originalFetch(input, init); // Fallback to the original fetch for other URLs
    }
});

global.fetch = mockFetch;

describe('Unstake queue', () => {
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
    test('should return the queue status', async () => {
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

        const unstakeTransactionData1 = await pool.buildUnstakeTransaction({
            vault: VAULT_ADDRESS,
            amount: parseEther('1'),
        });
        const unstakeHash1 = await client.sendTransaction({
            account: USER_ADDRESS,
            to: VAULT_ADDRESS,
            data: unstakeTransactionData1.transaction,
            type: 'eip1559',
            gas: unstakeTransactionData1.gasEstimation,
            maxPriorityFeePerGas: unstakeTransactionData1.maxPriorityFeePerGas,
            maxFeePerGas: unstakeTransactionData1.maxFeePerGas,
            chain: hardhat,
        });

        const unstakeTransactionData2 = await pool.buildUnstakeTransaction({
            vault: VAULT_ADDRESS,
            amount: parseEther('2'),
        });
        const unstakeHash2 = await client.sendTransaction({
            account: USER_ADDRESS,
            to: VAULT_ADDRESS,
            data: unstakeTransactionData2.transaction,
            type: 'eip1559',
            gas: unstakeTransactionData2.gasEstimation,
            maxPriorityFeePerGas: unstakeTransactionData2.maxPriorityFeePerGas,
            maxFeePerGas: unstakeTransactionData2.maxFeePerGas,
            chain: hardhat,
        });

        await mine(10);
        const unstakeReceipt1 = await publicClient.getTransactionReceipt({ hash: unstakeHash1 });
        expect(unstakeReceipt1.status).toEqual('success');
        const unstakeReceipt2 = await publicClient.getTransactionReceipt({ hash: unstakeHash2 });
        expect(unstakeReceipt2.status).toEqual('success');

        const unstakeQueue = await pool.getUnstakeQueueForVault(VAULT_ADDRESS);
        expect(unstakeQueue.length).toEqual(2);
        const earlierItem = unstakeQueue[0]; // The queue is sorted by timestamp
        const earlierMock = mockExitRequests[1];

        expect(earlierItem.when).toEqual(new Date(Number(earlierMock.timestamp) * 1000));
        expect(earlierItem.totalShares).toEqual(BigInt(earlierMock.totalShares));
        expect(earlierItem.totalAssets).toBeGreaterThan(BigInt(earlierMock.totalShares));
    });
});
