### getHealthFactorForUser

▸ **getHealthFactorForUser**(`mintedAssets`, `stakedAssets`): `Promise`\<[`OsTokenPositionHealth`](../../../enums/OsTokenPositionHealth.md)\>

Retrieves the vault position health for the user

Position health tracks the value of osETH minted relative to the user's staked ETH in the vault.
Healthy positions have well-collateralized osETH. Factors affecting position health include
yield discrepancies, fee structures, attestation performance, and validator activation delays.

Risky positions may enter redemption processes, while unhealthy positions are subject to
liquidation. This method calculates the health based on the minted osTokens (osETH) and the
staked ETH, helping users manage their staking strategy and mitigate risks.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `mintedAssets` | `bigint` | Amount of osTokens minted by the user |
| `stakedAssets` | `bigint` | Amount of ETH staked by the user |

#### Returns

`Promise`\<[`OsTokenPositionHealth`](../../../enums/OsTokenPositionHealth.md)\>

A promise that resolves to the position health

**`See`**

[Calculating Health Factor for Minting](https://chorus-one.gitbook.io/opus-pool-sdk-1.0/build-your-staking-dapp/5-minting-os-eth#calculating-health-factor-for-minting) for more information