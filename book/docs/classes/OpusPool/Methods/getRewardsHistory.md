### getRewardsHistory

▸ **getRewardsHistory**(`params`): `Promise`\<[`RewardsDataPoint`](../../../interfaces/RewardsDataPoint.md)[]\>

Retrieves the vault rewards history for a given user

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `params` | `Object` | Parameters for the rewards history query |
| `params.from` | `Date` | A starting date for the rewards retrieval query |
| `params.to` | `Date` | An end date for the rewards retrieval query |
| `params.vault` | \`0x$\{string}\` | An address of the vault to retrieve rewards for |

#### Returns

`Promise`\<[`RewardsDataPoint`](../../../interfaces/RewardsDataPoint.md)[]\>

An array of daily rewards amount data points