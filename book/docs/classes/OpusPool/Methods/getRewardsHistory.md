### getRewardsHistory

▸ **getRewardsHistory**(`params`): `Promise`\<[`RewardsDataPoint`](../../../interfaces/RewardsDataPoint.md)[]\>

Retrieves the vault rewards history for a given user

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `params` | `Object` | Parameters for the rewards history query |
| `params.from` | `Date` | A starting date for the rewards retrieval query |
| `params.to` | `Date` | An end date for the rewards retrieval query |
| `params.vault` | `Hex` | An address of the vault to retrieve rewards for |

#### Returns

`Promise`\<[`RewardsDataPoint`](../../../interfaces/RewardsDataPoint.md)[]\>

An array of daily rewards amount data points

**`See`**

[Rewards History](https://chorus-one.gitbook.io/opus-pool-sdk-1.0/build-your-staking-dapp/8-rewards-history) for more information