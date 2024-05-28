### buildUnstakeTransaction

▸ **buildUnstakeTransaction**(`params`): `Promise`\<[`UnstakeTransactionData`](../interfaces/UnstakeTransactionData.md)\>

Generates unstake transaction to withdraw from chosen Vault.

Integrations should utilize wallet interface of their own choosing to
broadcast the transaction via RPC nodes of their preference. This method
is stateless and only generates transaction bytes, leaving sign and broadcast
up to the code integrating SDK.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `params` | `Object` | params for request |
| `params.vault` | \`0x$\{string}\` | A vault address |
| `params.amount` | `bigint` | Amount of Eth to deposit, denominated in wei |

#### Returns

`Promise`\<[`UnstakeTransactionData`](../interfaces/UnstakeTransactionData.md)\>

`UnstakeTransactionData` for transaction to sign and broadcast