### buildStakeTransaction

▸ **buildStakeTransaction**(`params`): `Promise`\<[`StakeTransactionData`](../../../interfaces/StakeTransactionData.md)\>

Generates a stake transaction to deposit into the chosen vault

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `params` | `Object` | Parameters for building the transaction |
| `params.vault` | `Hex` | A vault address |
| `params.amount` | `bigint` | An amount of ETH to deposit, denominated in wei |
| `params.referrer?` | `Hex` | (Optional) The address of the referrer. This is used to track the origin of transactions, providing insights into which sources or campaigns are driving activity. This can be useful for analytics and optimizing user acquisition strategies. |

#### Returns

`Promise`\<[`StakeTransactionData`](../../../interfaces/StakeTransactionData.md)\>

A promise that resolves to a transaction data object

**`Remarks`**

Integrations should use their preferred wallet interface to broadcast the transaction via RPC nodes of
their choice. This method is stateless and only generates transaction bytes, leaving the signing and broadcasting up to
the code integrating the SDK

**`See`**

[Staking](https://chorus-one.gitbook.io/opus-pool-sdk-1.0/build-your-staking-dapp/3-staking) for more information