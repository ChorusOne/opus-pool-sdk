### getTransactionsHistory

▸ **getTransactionsHistory**(`vaults`): `Promise`\<[`VaultTransaction`](../../../interfaces/VaultTransaction.md)[]\>

Returns up to 1000 of the most recent transactions of the current user associated with the given vault

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `vaults` | \`0x$\{string}\`[] | An array of vault addresses to query the interactions for |

#### Returns

`Promise`\<[`VaultTransaction`](../../../interfaces/VaultTransaction.md)[]\>

A promise that resolves to an array of transactions corresponding to the given vaults