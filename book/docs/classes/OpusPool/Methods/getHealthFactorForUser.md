### getHealthFactorForUser

▸ **getHealthFactorForUser**(`mintedAssets`, `stakedAssets`): `Promise`\<[`OsTokenPositionHealth`](../../../enums/OsTokenPositionHealth.md)\>

Retrieves the vault position health for the user

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `mintedAssets` | `bigint` | Amount of osTokens minted by the user |
| `stakedAssets` | `bigint` | Amount of ETH staked by the user |

#### Returns

`Promise`\<[`OsTokenPositionHealth`](../../../enums/OsTokenPositionHealth.md)\>

A promise that resolves to the position health