### getVaultDetails

▸ **getVaultDetails**(`vaults`): `Promise`\<[`VaultDetails`](../../../interfaces/VaultDetails.md)[]\>

Provides information regarding vault details such as TVL, APY, description, logo, and the balance of the connected
customer in that vault

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `vaults` | \`0x$\{string}\`[] | An array of vault addresses to query the details for |

#### Returns

`Promise`\<[`VaultDetails`](../../../interfaces/VaultDetails.md)[]\>

A promise that resolves to an array of vault details corresponding to the given vaults