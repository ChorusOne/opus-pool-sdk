### getStakeBalanceForUser

▸ **getStakeBalanceForUser**(`vault`): `Promise`\<`StakeBalanceReturnType`\>

Retrieves stake balance for user in the vault

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `vault` | \`0x$\{string}\` | A vault address |

#### Returns

`Promise`\<`StakeBalanceReturnType`\>

- `StakeBalanceReturnType.assets` - Balance in ETH

- `StakeBalanceReturnType.shares` - Balance in vault tokens