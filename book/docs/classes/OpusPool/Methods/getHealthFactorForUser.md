### getHealthFactorForUser

▸ **getHealthFactorForUser**(`mintedAssets`, `stakedAssets`): `Promise`\<[`OsTokenPositionHealth`](../../../enums/OsTokenPositionHealth.md)\>

Retrieves health factor for the user

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `mintedAssets` | `bigint` | Amount of osTokens minted by the user |
| `stakedAssets` | `bigint` | Amount of ETH staked by the user |

#### Returns

`Promise`\<[`OsTokenPositionHealth`](../../../enums/OsTokenPositionHealth.md)\>

Position Health (enum)