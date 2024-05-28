### getUnstakeQueueForVault

▸ **getUnstakeQueueForVault**(`vault`): `Promise`\<[`UnstakeQueueItem`](../interfaces/UnstakeQueueItem.md)[]\>

Retrieves the unstake queue for the vault, including the user's position in the queue and shares waiting to be unstaked

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `vault` | \`0x$\{string}\` | A vault address |

#### Returns

`Promise`\<[`UnstakeQueueItem`](../interfaces/UnstakeQueueItem.md)[]\>

Array of `UnstakeQueueItem` objects corresponding to the queue, which are needed to withdraw from the queue