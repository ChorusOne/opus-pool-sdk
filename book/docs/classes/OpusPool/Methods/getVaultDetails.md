### getVaultDetails

▸ **getVaultDetails**(`vaults`): `Promise`\<[`VaultDetails`](../interfaces/VaultDetails.md)[]\>

Exposes information regarding vault details such as TVL, APY, description and logotype,
and also balance of connected customer in that Vault.

#### Parameters

| Name     | Type               | Description                                          |
| :------- | :----------------- | :--------------------------------------------------- |
| `vaults` | \`0x$\{string}\`[] | an array of vault addresses to query the details for |

#### Returns

`Promise`\<[`VaultDetails`](../interfaces/VaultDetails.md)[]\>

An array of `OpusVaultDetails` corresponding to given details