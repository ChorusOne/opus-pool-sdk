### buildMintTransaction

▸ **buildMintTransaction**(`params`): `Promise`\<[`MintTransactionData`](../../../interfaces/MintTransactionData.md)\>

Generates a mint transaction to mint osTokens from the chosen vault

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `params` | `Object` | Parameters for building the transaction |
| `params.shares` | `bigint` | An amount of shares to be minted |
| `params.vault` | `Hex` | A vault address |
| `params.referrer?` | `Hex` | An address of the referrer. Optional |

#### Returns

`Promise`\<[`MintTransactionData`](../../../interfaces/MintTransactionData.md)\>

A promise that resolves to a transaction data object

**`Remarks`**

Integrations should use their preferred wallet interface to broadcast the transaction via RPC nodes of
their choice. This method is stateless and only generates transaction bytes, leaving the signing and broadcasting up to
the code integrating the SDK

**`See`**

[Minting osETH](https://chorus-one.gitbook.io/opus-pool-sdk-1.0/build-your-staking-dapp/5-minting-os-eth) for more information