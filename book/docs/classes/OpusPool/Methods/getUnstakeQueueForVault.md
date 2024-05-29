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