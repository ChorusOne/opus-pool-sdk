### buildUnstakeTransaction

▸ **buildUnstakeTransaction**(`params`): `Promise`\<[`UnstakeTransactionData`](../../../interfaces/UnstakeTransactionData.md)\>

Generates unstake transaction data to withdraw from the chosen vault

The unstake transaction effectively moves the user's assets into an unstake queue where they remain until they
become eligible for withdrawal. This queue is a safeguard mechanism that ensures the liquidity and stability of
the vault by managing the flow of assets. To check the status of these assets, use the `getUnstakeQueueForVault`
method.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `params` | `Object` | Parameters for building the transaction |
| `params.vault` | `Hex` | A vault address |
| `params.amount` | `bigint` | An amount of ETH to unstake, denominated in wei |

#### Returns

`Promise`\<[`UnstakeTransactionData`](../../../interfaces/UnstakeTransactionData.md)\>

A promise that resolves to a transaction data object

**`Remarks`**

Integrations should use their preferred wallet interface to broadcast the transaction via RPC nodes of their
choice. This method is stateless and only generates transaction bytes, leaving the signing and broadcasting up to
the code integrating the SDK

**`See`**

[Unstaking](https://chorus-one.gitbook.io/opus-pool-sdk-1.0/build-your-staking-dapp/4-unstaking) for more information