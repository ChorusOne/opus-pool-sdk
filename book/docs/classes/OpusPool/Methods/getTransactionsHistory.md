### getTransactionsHistory

▸ **getTransactionsHistory**(`vaults`): `Promise`\<[`VaultTransaction`](../../../interfaces/VaultTransaction.md)[]\>

Returns up to 1000 Stake or Unstake interactions of current user with given Vault.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `vaults` | \`0x$\{string}\`[] | an array of vault addresses to query the interactions for |

#### Returns

`Promise`\<[`VaultTransaction`](../../../interfaces/VaultTransaction.md)[]\>

An array of `OpusVaultDetails` corresponding to given details