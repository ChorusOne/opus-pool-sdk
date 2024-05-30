### buildWithdrawUnstakedTransaction

▸ **buildWithdrawUnstakedTransaction**(`params`): `Promise`\<[`UnstakeQueueTransactionData`](../../../interfaces/UnstakeQueueTransactionData.md)\>

Generates transaction data to withdraw from the unstake queue

This method is the final step in the unstaking process. Once assets in the unstake
queue have reached a withdrawable state (as determined by the `getUnstakeQueueForVault` method),
the `buildWithdrawUnstakedTransaction` method prepares the transaction data necessary
for transferring these assets back into the user's wallet.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `params` | `Object` | Parameters for building the transaction |
| `params.vault` | `Hex` | A vault address |
| `params.queueItems` | [`UnstakeQueueItem`](../../../interfaces/UnstakeQueueItem.md)[] | An array of queue items to withdraw (see `getUnstakeQueueForVault`) |

#### Returns

`Promise`\<[`UnstakeQueueTransactionData`](../../../interfaces/UnstakeQueueTransactionData.md)\>

A promise that resolves to a transaction data object

**`Remarks`**

Integrations should use their preferred wallet interface to broadcast the transaction via RPC nodes of their
choice. This method is stateless and only generates transaction bytes, leaving the signing and broadcasting up to
the code integrating the SDK

**`See`**

[Unstaking](https://chorus-one.gitbook.io/opus-pool-sdk-1.0/build-your-staking-dapp/4-unstaking) for more information