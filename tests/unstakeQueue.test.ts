import {
    Hex,
    PrivateKeyAccount,
    PublicClient,
    WalletClient,
    createPublicClient,
    createWalletClient,
    decodeEventLog,
    formatEther,
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
import { resolve } from 'dns';

const VAULT_ADDRESS: Hex = '0x95d0db03d59658e1af0d977ecfe142f178930ac5';
const AMOUNT_TO_STAKE = parseEther('20');

const originalFetch = global.fetch;

// https://github.com/tc39/proposal-promise-with-resolvers/blob/main/polyfills.js
const withResolvers = <V = unknown, Err = unknown>() => {
    const out: {
        resolve: (value: V) => void;
        reject: (reason: Err) => void;
        promise: Promise<V>;
    } = {
        resolve: () => {},
        reject: () => {},
        promise: Promise.resolve() as Promise<V>,
    };

    out.promise = new Promise<V>((resolve, reject) => {
        out.resolve = resolve;
        out.reject = reject;
    });

    return out;
};

type VaultEvent = ReturnType<typeof decodeEventLog<typeof VaultABI, 'ExitQueueEntered'>>;

describe('Unstake queue', () => {
    let USER_ADDRESS: Hex;
    let publicClient: PublicClient;
    let client: WalletClient;
    let account: PrivateKeyAccount;
    let unwatch: () => void;

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

    afterEach(() => {
        unwatch();
    });

    test('should return the queue status', async () => {
        const pool = new OpusPool({
            address: USER_ADDRESS,
            network: Networks.Hardhat,
        });

        // Stake

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
        await mine(5);

        const stakeReceipt = await publicClient.getTransactionReceipt({ hash: stakeTxHash });
        expect(stakeReceipt.status).toEqual('success');

        // Watch for the ExitQueueEntered events to get data for the unstake queue

        const { resolve: eventsResolve, promise: eventsPromise } = withResolvers<VaultEvent[]>();
        const passedEvents: VaultEvent[] = [];

        unwatch = publicClient.watchEvent({
            onLogs: (logs) => {
                const nextEvents = logs
                    .map((l) =>
                        decodeEventLog({
                            abi: VaultABI,
                            data: l.data,
                            topics: l.topics,
                        }),
                    )
                    .filter((e): e is VaultEvent => e.eventName === 'ExitQueueEntered');
                passedEvents.push(...nextEvents);
                if (passedEvents.length === 2) {
                    eventsResolve(passedEvents.sort((a, b) => Number(a.args.shares) - Number(b.args.shares)));
                }
            },
        });

        // Unstake

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

        await mine(5);

        // Wait for the events to be processed

        const events = await eventsPromise;

        expect(events.length).toEqual(2);
        expect(Number(formatEther(events[0].args.shares))).toBeCloseTo(1);
        expect(typeof events[0].args.positionTicket === 'bigint').toBeTruthy();

        // Ensure that transactions are successful

        const unstakeReceipt1 = await publicClient.getTransactionReceipt({ hash: unstakeHash1 });
        expect(unstakeReceipt1.status).toEqual('success');
        const unstakeReceipt2 = await publicClient.getTransactionReceipt({ hash: unstakeHash2 });
        expect(unstakeReceipt2.status).toEqual('success');

        // mock the request to Stakewise with positionTicket and totalShares from the events

        const day = 24 * 60 * 60;
        const mockExitRequests = [
            {
                positionTicket: events[0].args.positionTicket.toString(),
                totalShares: events[0].args.shares.toString(),
                // earlier
                timestamp: Math.round((new Date().getTime() - 60000) / 1000 - day * 2).toString(),
            },
            {
                positionTicket: events[1].args.positionTicket.toString(),
                totalShares: events[1].args.shares.toString(),
                // later
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

        const unstakeQueue = await pool.getUnstakeQueueForVault(VAULT_ADDRESS);
        expect(unstakeQueue.length).toEqual(2);
        // The queue is sorted by the timestamp from latest to earliest
        const earlierItem = unstakeQueue[1];
        const earlierMock = mockExitRequests[0];

        expect(earlierItem.when).toEqual(new Date(Number(earlierMock.timestamp) * 1000));
        expect(earlierItem.totalShares).toEqual(BigInt(earlierMock.totalShares));
        expect(earlierItem.totalAssets).toBeGreaterThan(BigInt(earlierMock.totalShares));

        expect(earlierItem.exitQueueIndex).toBeUndefined();
        await expect(pool.buildWithdrawUnstakedTransaction(VAULT_ADDRESS, earlierItem)).rejects.toThrow(
            'exitQueueIndex is required',
        );
    }, 30000);
});
