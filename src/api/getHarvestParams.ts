import { Hex } from 'viem';
import { StakewiseConnector } from '../internal/connector';

export const getHarvestParams = async (connector: StakewiseConnector, vault: Hex) => {
    try {
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
        if (!harvestResponse.ok) {
            throw new Error('Invalid response from Stakewise');
        }
        const harvestData = await harvestResponse.json();
        if (harvestData.errors && harvestData.errors.length) {
            throw new Error(harvestData.errors[0].message);
        }
        if (!harvestData.data || !harvestData.data.harvestParams) {
            throw new Error('Vault data is missing or incomplete');
        }
        return harvestData.data.harvestParams;
    } catch (error) {
        throw new Error(`Error retrieving harvest params data: ${error instanceof Error ? error.message : error}`);
    }
};
