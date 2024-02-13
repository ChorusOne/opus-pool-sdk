import { Hex } from 'viem';
import { OpusPool } from '..';
import { StakewiseConnector } from '../internal/connector';
import { RewardsDataPoint } from '../types/rewards';

async function extractVaultUserRewards(
    connector: StakewiseConnector,
    vault: Hex,
    allocatorAddress: string,
    dateFrom: Date,
    dateTo: Date,
): Promise<RewardsDataPoint[]> {
    const vars_getRewards = {
        vaultAddress: vault,
        user: allocatorAddress.toLowerCase(),
        dateFrom: Math.floor(dateFrom.getTime() / 1000).toString(),
    };

    const rewardsData = await connector.graphqlRequest({
        type: 'api',
        op: 'UserRewards',
        query: `query UserRewards($user: String!, $vaultAddress: String!, $dateFrom: DateAsTimestamp!) { userRewards(user: $user, vaultAddress: $vaultAddress, dateFrom: $dateFrom) { date, sumRewards, }}`,
        variables: vars_getRewards,
    });

    if (!rewardsData.data.userRewards || rewardsData.data.userRewards.length === 0) {
        throw new Error(`Rewards data is missing the userRewards field or the field is empty`);
    }
    const dataPoints: RewardsDataPoint[] = [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    rewardsData.data.userRewards.forEach((reward: any) => {
        const when: Date = new Date(parseInt(reward.date) * 1000);
        if (when <= dateTo) {
            const sumRewards: string = reward.sumRewards;
            dataPoints.push({
                when: when,
                amount: BigInt(sumRewards),
                vault: vault,
            });
        }
    });

    return dataPoints;
}

export default async function rewardsHistory(
    pool: OpusPool,
    request: {
        from: Date;
        to: Date;
        vault: Hex;
    },
): Promise<Array<RewardsDataPoint>> {
    let vaultRewards: RewardsDataPoint[] = [];

    vaultRewards = await extractVaultUserRewards(
        pool.connector,
        request.vault,
        pool.userAccount,
        request.from,
        request.to,
    );

    return vaultRewards;
}
