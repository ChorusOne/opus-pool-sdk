# Class: OpusPool

This class serves as the main entry point for the OPUS Pool SDK. It provides methods to interact with the Stakewise V3
vaults, leveraging Chorus One’s MEV research to enhance staking returns. It enables vault and token operations,
facilitating integration into Ethereum-based applications.

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
- [getUnstakeQueueForVault](OpusPool.md#getunstakequeueforvault)
- [buildWithdrawUnstakedTransaction](OpusPool.md#buildwithdrawunstakedtransaction)
- [getRewardsHistory](OpusPool.md#getrewardshistory)
- [buildMintTransaction](OpusPool.md#buildminttransaction)
- [getMaxMintForVault](OpusPool.md#getmaxmintforvault)
- [getHealthFactorForUser](OpusPool.md#gethealthfactorforuser)
- [getStakeBalanceForUser](OpusPool.md#getstakebalanceforuser)
- [getOsTokenPositionForVault](OpusPool.md#getostokenpositionforvault)
- [getMaxUnstakeForUserForVault](OpusPool.md#getmaxunstakeforuserforvault)
- [buildBurnTransaction](OpusPool.md#buildburntransaction)

## Properties

### userAccount

• **userAccount**: \`0x$\{string}\`

Currently connected wallet address

## Constructors

### constructor

• **new OpusPool**(`params`): [`OpusPool`](OpusPool.md)

Creates an OpusPool instance

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `params` | `Object` | Initialization parameters |
| `params.address` | \`0x$\{string}\` | An address of the currently connected user wallet. If the user connects to a different wallet, OpusPool must be re-instantiated with a new user address |
| `params.network` | [`Networks`](../enums/Networks.md) | Network configuration (Networks.Ethereum or Networks.Holesky) |
| `params.rpcUrl?` | `string` | An RPC URL to interact with. If not provided, a default public node will be used. Optional |

#### Returns

[`OpusPool`](OpusPool.md)

An instance of OpusPool

## Methods

### getVaultDetails

▸ **getVaultDetails**(`vaults`): `Promise`\<[`VaultDetails`](../interfaces/VaultDetails.md)[]\>

Provides information regarding vault details such as TVL, APY, description, logo, and the balance of the connected
customer in that vault

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `vaults` | \`0x$\{string}\`[] | An array of vault addresses to query the details for |

#### Returns

`Promise`\<[`VaultDetails`](../interfaces/VaultDetails.md)[]\>

A promise that resolves to an array of vault details corresponding to the given vaults

___

### getTransactionsHistory

▸ **getTransactionsHistory**(`vaults`): `Promise`\<[`VaultTransaction`](../interfaces/VaultTransaction.md)[]\>

Returns up to 1000 of the most recent transactions of the current user associated with the given vault

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `vaults` | \`0x$\{string}\`[] | An array of vault addresses to query the interactions for |

#### Returns

`Promise`\<[`VaultTransaction`](../interfaces/VaultTransaction.md)[]\>

A promise that resolves to an array of transactions corresponding to the given vaults

___

### buildStakeTransaction

▸ **buildStakeTransaction**(`params`): `Promise`\<[`StakeTransactionData`](../interfaces/StakeTransactionData.md)\>

Generates a stake transaction to deposit into the chosen vault

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `params` | `Object` | Parameters for building the transaction |
| `params.vault` | \`0x$\{string}\` | A vault address |
| `params.amount` | `bigint` | An amount of ETH to deposit, denominated in wei |
| `params.referrer?` | \`0x$\{string}\` | An address of the referrer. Optional |

#### Returns

`Promise`\<[`StakeTransactionData`](../interfaces/StakeTransactionData.md)\>

A promise that resolves to a transaction data object

**`Remarks`**

Integrations should use their preferred wallet interface to broadcast the transaction via RPC nodes of
their choice. This method is stateless and only generates transaction bytes, leaving the signing and broadcasting up to
the code integrating the SDK

___

### buildUnstakeTransaction

▸ **buildUnstakeTransaction**(`params`): `Promise`\<[`UnstakeTransactionData`](../interfaces/UnstakeTransactionData.md)\>

Generates unstake transaction data to withdraw from the chosen vault

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `params` | `Object` | Parameters for building the transaction |
| `params.vault` | \`0x$\{string}\` | A vault address |
| `params.amount` | `bigint` | An amount of ETH to unstake, denominated in wei |

#### Returns

`Promise`\<[`UnstakeTransactionData`](../interfaces/UnstakeTransactionData.md)\>

A promise that resolves to a transaction data object

**`Remarks`**

Integrations should use their preferred wallet interface to broadcast the transaction via RPC nodes of
their choice. This method is stateless and only generates transaction bytes, leaving the signing and broadcasting up to
the code integrating the SDK

___

### getUnstakeQueueForVault

▸ **getUnstakeQueueForVault**(`vault`): `Promise`\<[`UnstakeQueueItem`](../interfaces/UnstakeQueueItem.md)[]\>

Retrieves the unstake queue for a vault, including the user's position in the queue and shares waiting to be unstaked

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `vault` | \`0x$\{string}\` | A vault address |

#### Returns

`Promise`\<[`UnstakeQueueItem`](../interfaces/UnstakeQueueItem.md)[]\>

A promise that resolves to an array of queue items

___

### buildWithdrawUnstakedTransaction

▸ **buildWithdrawUnstakedTransaction**(`params`): `Promise`\<[`UnstakeQueueTransactionData`](../interfaces/UnstakeQueueTransactionData.md)\>

Generates transaction data to withdraw from the unstake queue

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `params` | `Object` | Parameters for building the transaction |
| `params.vault` | \`0x$\{string}\` | A vault address |
| `params.queueItems` | [`UnstakeQueueItem`](../interfaces/UnstakeQueueItem.md)[] | An array of queue items to withdraw (see `getUnstakeQueueForVault`) |

#### Returns

`Promise`\<[`UnstakeQueueTransactionData`](../interfaces/UnstakeQueueTransactionData.md)\>

A promise that resolves to a transaction data object

**`Remarks`**

Integrations should use their preferred wallet interface to broadcast the transaction via RPC nodes of
their choice. This method is stateless and only generates transaction bytes, leaving the signing and broadcasting up to
the code integrating the SDK

___

### getRewardsHistory

▸ **getRewardsHistory**(`params`): `Promise`\<[`RewardsDataPoint`](../interfaces/RewardsDataPoint.md)[]\>

Retrieves the vault rewards history for a given user

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `params` | `Object` | Parameters for the rewards history query |
| `params.from` | `Date` | A starting date for the rewards retrieval query |
| `params.to` | `Date` | An end date for the rewards retrieval query |
| `params.vault` | \`0x$\{string}\` | An address of the vault to retrieve rewards for |

#### Returns

`Promise`\<[`RewardsDataPoint`](../interfaces/RewardsDataPoint.md)[]\>

An array of daily rewards amount data points

___

### buildMintTransaction

▸ **buildMintTransaction**(`params`): `Promise`\<[`MintTransactionData`](../interfaces/MintTransactionData.md)\>

Generates a mint transaction to mint osTokens from the chosen vault

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `params` | `Object` | Parameters for building the transaction |
| `params.shares` | `bigint` | An amount of shares to be minted |
| `params.vault` | \`0x$\{string}\` | A vault address |
| `params.referrer?` | \`0x$\{string}\` | An address of the referrer. Optional |

#### Returns

`Promise`\<[`MintTransactionData`](../interfaces/MintTransactionData.md)\>

A promise that resolves to a transaction data object

**`Remarks`**

Integrations should use their preferred wallet interface to broadcast the transaction via RPC nodes of
their choice. This method is stateless and only generates transaction bytes, leaving the signing and broadcasting up to
the code integrating the SDK

___

### getMaxMintForVault

▸ **getMaxMintForVault**(`vault`): `Promise`\<`bigint`\>

Retrieves the maximum amount of osTokens that can be minted by the user

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `vault` | \`0x$\{string}\` | A vault address |

#### Returns

`Promise`\<`bigint`\>

A promise that resolves to the max amount of osTokens that can be minted

___

### getHealthFactorForUser

▸ **getHealthFactorForUser**(`mintedAssets`, `stakedAssets`): `Promise`\<[`OsTokenPositionHealth`](../enums/OsTokenPositionHealth.md)\>

Retrieves the vault position health for the user

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `mintedAssets` | `bigint` | Amount of osTokens minted by the user |
| `stakedAssets` | `bigint` | Amount of ETH staked by the user |

#### Returns

`Promise`\<[`OsTokenPositionHealth`](../enums/OsTokenPositionHealth.md)\>

A promise that resolves to the position health

___

### getStakeBalanceForUser

▸ **getStakeBalanceForUser**(`vault`): `Promise`\<[`StakeBalanceReturnType`](../interfaces/StakeBalanceReturnType.md)\>

Retrieves the stake balance for the user in the vault

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `vault` | \`0x$\{string}\` | A vault address |

#### Returns

`Promise`\<[`StakeBalanceReturnType`](../interfaces/StakeBalanceReturnType.md)\>

A promise that resolves to an object with the balance in ETH and the balance in vault tokens

___

### getOsTokenPositionForVault

▸ **getOsTokenPositionForVault**(`vault`): `Promise`\<[`OsTokenPositionReturnType`](../interfaces/OsTokenPositionReturnType.md)\>

Retrieves the osToken position for the vault

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `vault` | \`0x$\{string}\` | A vault address |

#### Returns

`Promise`\<[`OsTokenPositionReturnType`](../interfaces/OsTokenPositionReturnType.md)\>

A promise that resolves to the osToken position data for the vault

___

### getMaxUnstakeForUserForVault

▸ **getMaxUnstakeForUserForVault**(`vault`): `Promise`\<`bigint`\>

Retrieves the maximum amount of ETH that can be unstaked

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `vault` | \`0x$\{string}\` | A vault address |

#### Returns

`Promise`\<`bigint`\>

A promise that resolves to the max amount of ETH that can be unstaked

___

### buildBurnTransaction

▸ **buildBurnTransaction**(`params`): `Promise`\<[`BurnTransactionData`](../interfaces/BurnTransactionData.md)\>

Generates a burn transaction to burn osTokens from the chosen vault

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `params` | `Object` | Parameters for building the transaction |
| `params.shares` | `bigint` | An amount of shares to be burned |
| `params.vault` | \`0x$\{string}\` | A vault address |

#### Returns

`Promise`\<[`BurnTransactionData`](../interfaces/BurnTransactionData.md)\>

A promise that resolves to a transaction data object

**`Remarks`**

Integrations should use their preferred wallet interface to broadcast the transaction via RPC nodes of
their choice. This method is stateless and only generates transaction bytes, leaving the signing and broadcasting up to
the code integrating the SDK
