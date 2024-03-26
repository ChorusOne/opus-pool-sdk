import { Hex } from 'viem';
import { OpusPool } from '..';
import { VaultABI } from '../internal/contracts/vaultAbi';

export const getUnstakeQueue = async (pool: OpusPool, vault: Hex) => {
    const queueData = await pool.connector.graphqlRequest({
        type: 'graph',
        op: 'exitQueue',
        query: `
            query exitQueue($receiver: Bytes, $vault: String!) {
              exitRequests(where: {
                receiver: $receiver,
                vault: $vault,
              }) {
                positionTicket
                totalShares
                timestamp
              }
            }
            `,
        variables: {
            vault: vault.toLowerCase(),
            receiver: pool.userAccount,
        },
    });

    if (!queueData.data.exitRequests) {
        // throw new Error('Queue data is missing the exitRequests field');
        return [];
    }

    return parseQueueData({
        exitRequests: queueData.data.exitRequests.map((r: any) => ({
            positionTicket: BigInt(r.positionTicket),
            totalShares: BigInt(r.totalShares),
            when: new Date(Number(r.timestamp) * 1000),
        })),
        pool,
        userAddress: pool.userAccount,
        vaultAddress: vault,
    });
};

type ParseQueueDataArgs = {
    pool: OpusPool;
    userAddress: Hex;
    vaultAddress: Hex;
    exitRequests: Array<{
        positionTicket: bigint;
        totalShares: bigint;
        when: Date;
    }>;
};

interface BaseUnstakeQueueItem {
    exitQueueIndex?: bigint;
    positionTicket: bigint;
    when: Date;
    isWithdrawable: false;
    totalShares: bigint;
    totalAssets: bigint;
}
interface FullUnstakeQueueItem extends Omit<BaseUnstakeQueueItem, 'isWithdrawable'> {
    isWithdrawable: true;
    exitQueueIndex: bigint;
    leftShares: bigint;
    leftAssets: bigint;
    withdrawableShares: bigint;
    withdrawableAssets: bigint;
}

export type UnstakeQueueItem = BaseUnstakeQueueItem | FullUnstakeQueueItem;

const getIs24HoursPassed = async (when: Date, pool: OpusPool) => {
    const lastBlock = await pool.connector.eth.getBlock();

    const current = lastBlock ? lastBlock.timestamp : Number((new Date().getTime() / 1000).toFixed(0));

    const diff = Number(current) - Number(when.getTime() / 1000);

    return diff > 86_400; // 24 hours
};

const parseQueueData = async ({ pool, userAddress, vaultAddress, exitRequests }: ParseQueueDataArgs) => {
    const unstakeQueue = await Promise.all(
        exitRequests.map(async (exitRequest): Promise<UnstakeQueueItem> => {
            const { positionTicket, when, totalShares } = exitRequest;

            // We must fetch the exit queue index for every position.
            // Based on the response we can determine if we can claim exited assets.
            const baseExitQueueIndex = await pool.connector.eth.readContract({
                abi: VaultABI,
                address: vaultAddress,
                functionName: 'getExitQueueIndex',
                args: [positionTicket],
            });

            const exitQueueIndex = baseExitQueueIndex > -1n ? baseExitQueueIndex : undefined;

            // 24 hours must have elapsed since the position was created
            const is24HoursPassed = await getIs24HoursPassed(when, pool);

            // If the index is -1 then we cannot claim anything. Otherwise, the value is >= 0.
            const isValid = exitQueueIndex !== undefined;

            const isWithdrawable = isValid && is24HoursPassed;

            const totalAssets = await pool.connector.eth.readContract({
                abi: VaultABI,
                address: vaultAddress,
                functionName: 'convertToAssets',
                args: [totalShares],
            });

            if (!isWithdrawable || exitQueueIndex === undefined) {
                const basePosition: BaseUnstakeQueueItem = {
                    exitQueueIndex,
                    positionTicket,
                    when,
                    isWithdrawable: false,
                    totalShares,
                    totalAssets,
                };
                return basePosition;
            }

            const [leftShares, withdrawableShares, withdrawableAssets] = await pool.connector.eth.readContract({
                abi: VaultABI,
                address: vaultAddress,
                functionName: 'calculateExitedAssets',
                args: [userAddress, positionTicket, BigInt(Number(when) / 1000), exitQueueIndex] as const,
            });

            const leftAssets = await pool.connector.eth.readContract({
                abi: VaultABI,
                address: vaultAddress,
                functionName: 'convertToAssets',
                args: [leftShares],
            });

            const fullPosition: FullUnstakeQueueItem = {
                positionTicket,
                when,
                totalShares,
                isWithdrawable: true,
                exitQueueIndex,
                totalAssets,
                leftShares,
                leftAssets,
                withdrawableShares,
                withdrawableAssets,
            };
            return fullPosition;
        }),
    );

    return unstakeQueue.sort((a, b) => Number(b.when) - Number(a.when));
};
