import { Hex } from 'viem';
import { StakewiseConnector } from '../internal/connector';

export const getHarvestParams = async (connector: StakewiseConnector, vault: Hex) => {
    const harvestResponse = await connector.graphqlRequest({
        type: 'graph',
        op: 'HarvestParams',
        query: `
        query HarvestParams($address: ID!) {
        harvestParams: vault(id: $address) {
            proof
            rewardsRoot
            reward: proofReward
            unlockedMevReward: proofUnlockedMevReward
          }
        }
        `,
        variables: {
            address: vault.toLowerCase(),
        },
        onSuccess: function (value: Response) {
            return value;
        },
        onError: function (reason: any): PromiseLike<never> {
            throw new Error(`Failed to get harvest from Stakewise: ${reason}`);
        },
    });
    const harvestData = await harvestResponse.json();
    return harvestData.data.harvestParams;
};
