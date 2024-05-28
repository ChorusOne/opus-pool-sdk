### buildMintTransaction

▸ **buildMintTransaction**(`params`): `Promise`\<[`MintTransactionData`](../../../interfaces/MintTransactionData.md)\>

Generates mint transaction to mint osTokens from chosen Vault.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `params` | `Object` | params for request |
| `params.shares` | `bigint` | Amount of osTokens to mint |
| `params.vault` | \`0x$\{string}\` | A vault address |
| `params.referrer?` | \`0x$\{string}\` | Address of the referrer. Optional. |

#### Returns

`Promise`\<[`MintTransactionData`](../../../interfaces/MintTransactionData.md)\>

`MintTransactionData` for transaction to sign and broadcast