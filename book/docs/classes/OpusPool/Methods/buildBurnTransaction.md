### buildBurnTransaction

▸ **buildBurnTransaction**(`params`): `Promise`\<[`BurnTransactionData`](../interfaces/BurnTransactionData.md)\>

Generates burn transaction to burn osTokens from chosen Vault.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `params` | `Object` | params for request |
| `params.shares` | `bigint` | Amount of osTokens to burn |
| `params.vault` | \`0x$\{string}\` | A vault address |

#### Returns

`Promise`\<[`BurnTransactionData`](../interfaces/BurnTransactionData.md)\>

`BurnTransactionData` for transaction to sign and broadcast