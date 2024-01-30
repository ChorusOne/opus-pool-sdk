# Class: OpusPool

Pooling solution

## Table of contents

### Properties

- [userAccount](OpusPool.md#useraccount)

### Constructors

- [constructor](OpusPool.md#constructor)

### Methods

- [getVaultDetails](OpusPool.md#getvaultdetails)
- [getTransactionsHistory](OpusPool.md#gettransactionshistory)
- [buildStakeTransaction](OpusPool.md#buildstaketransaction)
- [buildUnstakeTransaction](OpusPool.md#buildunstaketransaction)
- [getRewardsHistory](OpusPool.md#getrewardshistory)
- [buildMintTransaction](OpusPool.md#buildminttransaction)
- [getMaxMintForVault](OpusPool.md#getmaxmintforvault)
- [getHealthFactorForUser](OpusPool.md#gethealthfactorforuser)
- [getPoolBaseData](OpusPool.md#getpoolbasedata)
- [getStakeBalanceForUser](OpusPool.md#getstakebalanceforuser)
- [getOsTokenPositionForVault](OpusPool.md#getostokenpositionforvault)

## Properties

### userAccount

• **userAccount**: \`0x$\{string}\`

Currently connected Ethereum address

## Constructors

### constructor

• **new OpusPool**(`params`): [`OpusPool`](OpusPool.md)

Instantiates pooling solution facade that provides convenience methods
to allow staking for individual user.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `params` | `Object` | Parameters to configure the pooling solution interface. |
| `params.address` | \`0x$\{string}\` | An address of currently connected user wallet. If user connects different wallet, pooling solution implementation must be re-instantiated with a new user address. |
| `params.network` | [`Networks`](../enums/Networks.md) | One of holesky, ethereum, hardhat |
| `params.rpcUrl?` | `string` | RPC Url to interact with If not defined, either public node |

#### Returns

[`OpusPool`](OpusPool.md)

## Methods

### getVaultDetails

▸ **getVaultDetails**(`vaults`): `Promise`\<[`VaultDetails`](../interfaces/VaultDetails.md)[]\>

Exposes information regarding vault details such as TVL, APY, description and logotype,
 and also balance of connected customer in that Vault.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `vaults` | \`0x$\{string}\`[] | an array of vault addresses to query the details for |

#### Returns

`Promise`\<[`VaultDetails`](../interfaces/VaultDetails.md)[]\>

An array of `OpusVaultDetails` corresponding to given details

___

### getTransactionsHistory

▸ **getTransactionsHistory**(`vaults`): `Promise`\<[`VaultTransaction`](../interfaces/VaultTransaction.md)[]\>

Returns up to 1000 Stake or Unstake interactions of current user with given Vault.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `vaults` | \`0x$\{string}\`[] | an array of vault addresses to query the interactions for |

#### Returns

`Promise`\<[`VaultTransaction`](../interfaces/VaultTransaction.md)[]\>

An array of `OpusVaultDetails` corresponding to given details

___

### buildStakeTransaction

▸ **buildStakeTransaction**(`params`): `Promise`\<[`StakingTransactionData`](../interfaces/StakingTransactionData.md)\>

Generates stake transaction to deposit into chosen Vault

 Integrations should utilize wallet interface of their own choosing to
broadcast the transaction via RPC nodes of their preference. This method
is stateless and only generates transaction bytes, leaving sign and broadcast
up to the code integrating SDK.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `params` | `Object` | params for request |
| `params.vault` | \`0x$\{string}\` | A vault address |
| `params.amount` | `bigint` | Amount of Eth to deposit, denominated in gwei |
| `params.referrer?` | \`0x$\{string}\` | - |

#### Returns

`Promise`\<[`StakingTransactionData`](../interfaces/StakingTransactionData.md)\>

`StakingTransactionData` for transaction to sign and broadcast

___

### buildUnstakeTransaction

▸ **buildUnstakeTransaction**(`params`): `Promise`\<[`StakingTransactionData`](../interfaces/StakingTransactionData.md)\>

Generates unstake transaction to withdraw from chosen Vault.

Integrations should utilize wallet interface of their own choosing to
broadcast the transaction via RPC nodes of their preference. This method
is stateless and only generates transaction bytes, leaving sign and broadcast
up to the code integrating SDK.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `params` | `Object` | params for request |
| `params.vault` | \`0x$\{string}\` | A vault address |
| `params.amount` | `bigint` | Amount of Eth to deposit, denominated in gwei |

#### Returns

`Promise`\<[`StakingTransactionData`](../interfaces/StakingTransactionData.md)\>

`StakingTransactionData` for transaction to sign and broadcast

___

### getRewardsHistory

▸ **getRewardsHistory**(`params`): `Promise`\<[`RewardsDataPoint`](../interfaces/RewardsDataPoint.md)[]\>

Retrieves rewards history for customer, earned via specific Vaults

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `params` | `Object` | params for request |
| `params.from` | `Date` | Starting date for the rewards retrieval query |
| `params.to` | `Date` | End date for the rewards retrieval query |
| `params.vault` | \`0x$\{string}\` | Address of the vault to retrieve rewards for |

#### Returns

`Promise`\<[`RewardsDataPoint`](../interfaces/RewardsDataPoint.md)[]\>

Array of daily rewards amount data points

___

### buildMintTransaction

▸ **buildMintTransaction**(`params`): `Promise`\<[`StakingTransactionData`](../interfaces/StakingTransactionData.md)\>

Generates mint transaction to mint osTokens from chosen Vault.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `params` | `Object` | params for request |
| `params.shares` | `bigint` | Amount of osTokens to mint |
| `params.vault` | \`0x$\{string}\` | A vault address |
| `params.referrer?` | \`0x$\{string}\` | Address of the referrer. Optional. |

#### Returns

`Promise`\<[`StakingTransactionData`](../interfaces/StakingTransactionData.md)\>

`MintTransactionData` for transaction to sign and broadcast

___

### getMaxMintForVault

▸ **getMaxMintForVault**(`vault_address`): `Promise`\<`bigint`\>

Retrieves maximum amount of osTokens that can be minted by the user

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `vault_address` | \`0x$\{string}\` | A vault address |

#### Returns

`Promise`\<`bigint`\>

Amount of osTokens that can be minted

___

### getHealthFactorForUser

▸ **getHealthFactorForUser**(`mintedAssets`, `stakedAssets`): `Promise`\<`OsTokenPositionHealth`\>

Retrieves health factor for the user

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `mintedAssets` | `bigint` | Amount of osTokens minted by the user |
| `stakedAssets` | `bigint` | Amount of osTokens staked by the user |

#### Returns

`Promise`\<`OsTokenPositionHealth`\>

Health factor for the user

___

### getPoolBaseData

▸ **getPoolBaseData**(): `Promise`\<\{ `ltvPercent`: `bigint` ; `thresholdPercent`: `bigint`  }\>

Retrieves base data for the pool

#### Returns

`Promise`\<\{ `ltvPercent`: `bigint` ; `thresholdPercent`: `bigint`  }\>

Base data for the pool

___

### getStakeBalanceForUser

▸ **getStakeBalanceForUser**(`vault_address`): `Promise`\<\{ `assets`: `bigint` ; `shares`: `bigint`  }\>

Retrieves stake balance for user in the vault

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `vault_address` | \`0x$\{string}\` | A vault address |

#### Returns

`Promise`\<\{ `assets`: `bigint` ; `shares`: `bigint`  }\>

shares -  for the user

assets - staked amount for the user

___

### getOsTokenPositionForVault

▸ **getOsTokenPositionForVault**(`vault_address`): `Promise`\<`OsTokenPositionReturnType`\>

Retrieves osToken position for the vault

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `vault_address` | \`0x$\{string}\` | A vault address |

#### Returns

`Promise`\<`OsTokenPositionReturnType`\>

osToken position for the user
