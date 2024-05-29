### buildStakeTransaction

▸ **buildStakeTransaction**(`params`): `Promise`\<[`StakeTransactionData`](../../../interfaces/StakeTransactionData.md)\>

Generates a stake transaction to deposit into the chosen vault

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `params` | `Object` | Parameters for building the transaction |
| `params.vault` | \`0x$\{string}\` | A vault address |
| `params.amount` | `bigint` | An amount of ETH to deposit, denominated in wei |
| `params.referrer?` | \`0x$\{string}\` | An address of the referrer. Optional |

#### Returns

`Promise`\<[`StakeTransactionData`](../../../interfaces/StakeTransactionData.md)\>

A promise that resolves to a transaction data object

**`Remarks`**

Integrations should use their preferred wallet interface to broadcast the transaction via RPC nodes of
their choice. This method is stateless and only generates transaction bytes, leaving the signing and broadcasting up to
the code integrating the SDK