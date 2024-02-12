import { Hex } from 'viem';
import { StakewiseConnector } from '../internal/connector';

export const getHarvestParams = async (connector: StakewiseConnector, vault: Hex) => {
    try {
        const harvestData = await connector.graphqlRequest({
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
            onSuccess: (value: { data: any }) => value,
            onError: function (reason: any): PromiseLike<never> {
                throw new Error(`Failed to get harvest from Stakewise: ${reason}`);
            },
        });

        if (!harvestData.data.harvestParams) {
            throw new Error('Vault data is missing the harvestParams field');
        }
        return harvestData.data.harvestParams;
    } catch (error) {
        throw new Error(`Error retrieving harvest params data: ${error instanceof Error ? error.message : error}`);
    }
};
