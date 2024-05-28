### getRewardsHistory

▸ **getRewardsHistory**(`params`): `Promise`\<[`RewardsDataPoint`](../interfaces/RewardsDataPoint.md)[]\>

Retrieves rewards history for customer, earned via specific Vaults

#### Parameters

| Name           | Type             | Description                                   |
| :------------- | :--------------- | :-------------------------------------------- |
| `params`       | `Object`         | params for request                            |
| `params.from`  | `Date`           | Starting date for the rewards retrieval query |
| `params.to`    | `Date`           | End date for the rewards retrieval query      |
| `params.vault` | \`0x$\{string}\` | Address of the vault to retrieve rewards for  |

#### Returns

`Promise`\<[`RewardsDataPoint`](../interfaces/RewardsDataPoint.md)[]\>

Array of daily rewards amount data points