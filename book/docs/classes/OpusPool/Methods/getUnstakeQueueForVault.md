### getUnstakeQueueForVault

▸ **getUnstakeQueueForVault**(`vault`): `Promise`\<[`UnstakeQueueItem`](../../../interfaces/UnstakeQueueItem.md)[]\>

Retrieves the unstake queue for a vault, including the user's position in the queue and shares waiting to be unstaked

After initiating an unstake request using the `buildUnstakeTransaction` method, assets are placed into an unstake
queue.

The `getUnstakeQueueForVault` method allows users to query the queue to check the current state of their unstake
requests, including their position in the queue, the amount of shares that are pending unstaking, the date and
time of the request, and whether the assets are withdrawable.

To prepare the transaction for withdrawing these assets, use the `buildWithdrawUnstakedTransaction` method.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `vault` | `Hex` | A vault address |

#### Returns

`Promise`\<[`UnstakeQueueItem`](../../../interfaces/UnstakeQueueItem.md)[]\>

A promise that resolves to an array of queue items

**`See`**

[Fetching the Unstake Queue](https://chorus-one.gitbook.io/opus-pool-sdk-1.0/build-your-staking-dapp/4-unstaking#fetching-the-unstake-queue) for more information