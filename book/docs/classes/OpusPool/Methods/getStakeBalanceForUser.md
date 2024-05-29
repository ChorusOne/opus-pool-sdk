### getStakeBalanceForUser

▸ **getStakeBalanceForUser**(`vault`): `Promise`\<[`StakeBalanceReturnType`](../../../interfaces/StakeBalanceReturnType.md)\>

Retrieves the stake balance for the user in the vault

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `vault` | \`0x$\{string}\` | A vault address |

#### Returns

`Promise`\<[`StakeBalanceReturnType`](../../../interfaces/StakeBalanceReturnType.md)\>

A promise that resolves to an object with the balance in ETH and the balance in vault tokens

**`See`**

[Calculating Health Factor for Minting](https://chorus-one.gitbook.io/opus-pool-sdk-1.0/build-your-staking-dapp/5-minting-os-eth#calculating-health-factor-for-minting) for more information