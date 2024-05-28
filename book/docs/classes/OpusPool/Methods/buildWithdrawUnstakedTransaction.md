### buildWithdrawUnstakedTransaction

▸ **buildWithdrawUnstakedTransaction**(`params`): `Promise`\<[`UnstakeQueueTransactionData`](../interfaces/UnstakeQueueTransactionData.md)\>

Generates transaction to withdraw from the unstake queue.

Integrations should utilize wallet interface of their own choosing to
broadcast the transaction via RPC nodes of their preference. This method
is stateless and only generates transaction bytes, leaving sign and broadcast
up to the code integrating SDK.

#### Parameters

| Name                | Type                                                      | Description                                                                                   |
| :------------------ | :-------------------------------------------------------- | :-------------------------------------------------------------------------------------------- |
| `params`            | `Object`                                                  | params for request                                                                            |
| `params.vault`      | \`0x$\{string}\`                                          | A vault address                                                                               |
| `params.queueItems` | [`UnstakeQueueItem`](../interfaces/UnstakeQueueItem.md)[] | Array of `UnstakeQueueItem` objects corresponding to the queue(see `getUnstakeQueueForVault`) |

#### Returns

`Promise`\<[`UnstakeQueueTransactionData`](../interfaces/UnstakeQueueTransactionData.md)\>

`UnstakeQueueTransactionData` for transaction to sign and broadcast