### getUnstakeQueueForVault

▸ **getUnstakeQueueForVault**(`vault`): `Promise`\<[`UnstakeQueueItem`](../../../interfaces/UnstakeQueueItem.md)[]\>

Retrieves the unstake queue for a vault, including the user's position in the queue and shares waiting to be unstaked

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `vault` | \`0x$\{string}\` | A vault address |

#### Returns

`Promise`\<[`UnstakeQueueItem`](../../../interfaces/UnstakeQueueItem.md)[]\>

A promise that resolves to an array of queue items

**`See`**

[Fetching the Unstake Queue](https://chorus-one.gitbook.io/opus-pool-sdk-1.0/build-your-staking-dapp/4-unstaking#fetching-the-unstake-queue) for more information