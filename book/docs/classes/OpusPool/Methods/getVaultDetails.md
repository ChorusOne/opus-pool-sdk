### getVaultDetails

▸ **getVaultDetails**(`vaults`): `Promise`\<[`VaultDetails`](../../../interfaces/VaultDetails.md)[]\>

Provides information regarding vault details such as TVL, APY, description, logo, and the balance of the connected
customer in that vault

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `vaults` | `Hex`[] | An array of vault addresses to query the details for |

#### Returns

`Promise`\<[`VaultDetails`](../../../interfaces/VaultDetails.md)[]\>

A promise that resolves to an array of vault details corresponding to the given vaults

**`See`**

[Fetching Vault Details](https://chorus-one.gitbook.io/opus-pool-sdk-1.0/build-your-staking-dapp/2-fetching-vault-details) for more information