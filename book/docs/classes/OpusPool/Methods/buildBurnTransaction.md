### buildBurnTransaction

▸ **buildBurnTransaction**(`params`): `Promise`\<[`BurnTransactionData`](../../../interfaces/BurnTransactionData.md)\>

Generates a burn transaction to burn osTokens from the chosen vault

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `params` | `Object` | Parameters for building the transaction |
| `params.shares` | `bigint` | An amount of shares to be burned |
| `params.vault` | \`0x$\{string}\` | A vault address |

#### Returns

`Promise`\<[`BurnTransactionData`](../../../interfaces/BurnTransactionData.md)\>

A promise that resolves to a transaction data object

**`Remarks`**

Integrations should use their preferred wallet interface to broadcast the transaction via RPC nodes of
their choice. This method is stateless and only generates transaction bytes, leaving the signing and broadcasting up to
the code integrating the SDK

**`See`**

[Burning osETH](https://chorus-one.gitbook.io/opus-pool-sdk-1.0/build-your-staking-dapp/6-burning-os-eth) for more information