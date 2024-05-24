# Class: OpusPool

Pooling solution

## Table of contents

### Properties

-   [userAccount](OpusPool.md#useraccount)

### Constructors

-   [constructor](OpusPool.md#constructor)

### Methods

-   [getVaultDetails](OpusPool.md#getvaultdetails)
-   [getTransactionsHistory](OpusPool.md#gettransactionshistory)
-   [buildStakeTransaction](OpusPool.md#buildstaketransaction)
-   [buildUnstakeTransaction](OpusPool.md#buildunstaketransaction)
-   [getUnstakeQueueForVault](OpusPool.md#getunstakequeueforvault)
-   [buildWithdrawUnstakedTransaction](OpusPool.md#buildwithdrawunstakedtransaction)
-   [getRewardsHistory](OpusPool.md#getrewardshistory)
-   [buildMintTransaction](OpusPool.md#buildminttransaction)
-   [getMaxMintForVault](OpusPool.md#getmaxmintforvault)
-   [getHealthFactorForUser](OpusPool.md#gethealthfactorforuser)
-   [getStakeBalanceForUser](OpusPool.md#getstakebalanceforuser)
-   [getOsTokenPositionForVault](OpusPool.md#getostokenpositionforvault)
-   [getMaxUnstakeForUserForVault](OpusPool.md#getmaxunstakeforuserforvault)
-   [buildBurnTransaction](OpusPool.md#buildburntransaction)

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

| Name             | Type                               | Description                                                                                                                                                        |
| :--------------- | :--------------------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `params`         | `Object`                           | Parameters to configure the pooling solution interface.                                                                                                            |
| `params.address` | \`0x$\{string}\`                   | An address of currently connected user wallet. If user connects different wallet, pooling solution implementation must be re-instantiated with a new user address. |
| `params.network` | [`Networks`](../enums/Networks.md) | One of holesky, ethereum, hardhat                                                                                                                                  |
| `params.rpcUrl?` | `string`                           | RPC Url to interact with If not defined, either public node                                                                                                        |

#### Returns

[`OpusPool`](OpusPool.md)

## Methods

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

---

### getTransactionsHistory

▸ **getTransactionsHistory**(`vaults`): `Promise`\<[`VaultTransaction`](../interfaces/VaultTransaction.md)[]\>

Returns up to 1000 Stake or Unstake interactions of current user with given Vault.

#### Parameters

| Name     | Type               | Description                                               |
| :------- | :----------------- | :-------------------------------------------------------- |
| `vaults` | \`0x$\{string}\`[] | an array of vault addresses to query the interactions for |

#### Returns

`Promise`\<[`VaultTransaction`](../interfaces/VaultTransaction.md)[]\>

An array of `OpusVaultDetails` corresponding to given details

---

### buildStakeTransaction

▸ **buildStakeTransaction**(`params`): `Promise`\<[`StakeTransactionData`](../interfaces/StakeTransactionData.md)\>

Generates stake transaction to deposit into chosen Vault

Integrations should utilize wallet interface of their own choosing to
broadcast the transaction via RPC nodes of their preference. This method
is stateless and only generates transaction bytes, leaving sign and broadcast
up to the code integrating SDK.

#### Parameters

| Name               | Type             | Description                                  |
| :----------------- | :--------------- | :------------------------------------------- |
| `params`           | `Object`         | params for request                           |
| `params.vault`     | \`0x$\{string}\` | A vault address                              |
| `params.amount`    | `bigint`         | Amount of Eth to deposit, denominated in wei |
| `params.referrer?` | \`0x$\{string}\` | Address of the referrer. Optional.           |

#### Returns

`Promise`\<[`StakeTransactionData`](../interfaces/StakeTransactionData.md)\>

-   `StakeTransactionData`

-   `StakeTransactionData.transaction` - Transaction to sign and broadcast

-   `StakeTransactionData.amount` - Amount of Eth to deposit, denominated in wei

-   `StakeTransactionData.gasEstimation` - Gas estimation in wei

-   `StakeTransactionData.maxPriorityFeePerGas` - Max priority fee per gas to use for network

-   `StakeTransactionData.maxFeePerGas` - Max fee per gas to use for network

---

### buildUnstakeTransaction

▸ **buildUnstakeTransaction**(`params`): `Promise`\<[`UnstakeTransactionData`](../interfaces/UnstakeTransactionData.md)\>

Generates unstake transaction to withdraw from chosen Vault.

Integrations should utilize wallet interface of their own choosing to
broadcast the transaction via RPC nodes of their preference. This method
is stateless and only generates transaction bytes, leaving sign and broadcast
up to the code integrating SDK.

#### Parameters

| Name            | Type             | Description                                  |
| :-------------- | :--------------- | :------------------------------------------- |
| `params`        | `Object`         | params for request                           |
| `params.vault`  | \`0x$\{string}\` | A vault address                              |
| `params.amount` | `bigint`         | Amount of Eth to deposit, denominated in wei |

#### Returns

`Promise`\<[`UnstakeTransactionData`](../interfaces/UnstakeTransactionData.md)\>

`UnstakeTransactionData` for transaction to sign and broadcast

---

### getUnstakeQueueForVault

▸ **getUnstakeQueueForVault**(`vault`): `Promise`\<[`UnstakeQueueItem`](../interfaces/UnstakeQueueItem.md)[]\>

Retrieves the unstake queue for the vault, including the user's position in the queue and shares waiting to be unstaked

#### Parameters

| Name    | Type             | Description     |
| :------ | :--------------- | :-------------- |
| `vault` | \`0x$\{string}\` | A vault address |

#### Returns

`Promise`\<[`UnstakeQueueItem`](../interfaces/UnstakeQueueItem.md)[]\>

Array of `UnstakeQueueItem` objects corresponding to the queue, which are needed to withdraw from the queue

---

### buildWithdrawUnstakedTransaction

▸ **buildWithdrawUnstakedTransaction**(`params`): `Promise`\<[`UnstakeQueueTransactionData`](../interfaces/UnstakeQueueTransactionData.md)\>

Generates transaction to withdraw from the unstake queue.

Integrations should utilize wallet interface of their own choosing to
broadcast the transaction via RPC nodes of their preference. This method
is stateless and only generates transaction bytes, leaving sign and broadcast
up to the code integrating SDK.

#### Parameters

| Name                | Type                                                      | Description                                                                                   |
| :------------------ | :-------------------------------------------------------- | :-------------------------------------------------------------------------------------------- |
| `params`            | `Object`                                                  | params for request                                                                            |
| `params.vault`      | \`0x$\{string}\`                                          | A vault address                                                                               |
| `params.queueItems` | [`UnstakeQueueItem`](../interfaces/UnstakeQueueItem.md)[] | Array of `UnstakeQueueItem` objects corresponding to the queue(see `getUnstakeQueueForVault`) |

#### Returns

`Promise`\<[`UnstakeQueueTransactionData`](../interfaces/UnstakeQueueTransactionData.md)\>

`UnstakeQueueTransactionData` for transaction to sign and broadcast

---

### getRewardsHistory

▸ **getRewardsHistory**(`params`): `Promise`\<[`RewardsDataPoint`](../interfaces/RewardsDataPoint.md)[]\>

Retrieves rewards history for customer, earned via specific Vaults

#### Parameters

| Name           | Type             | Description                                   |
| :------------- | :--------------- | :-------------------------------------------- |
| `params`       | `Object`         | params for request                            |
| `params.from`  | `Date`           | Starting date for the rewards retrieval query |
| `params.to`    | `Date`           | End date for the rewards retrieval query      |
| `params.vault` | \`0x$\{string}\` | Address of the vault to retrieve rewards for  |

#### Returns

`Promise`\<[`RewardsDataPoint`](../interfaces/RewardsDataPoint.md)[]\>

Array of daily rewards amount data points

---

### buildMintTransaction

▸ **buildMintTransaction**(`params`): `Promise`\<[`MintTransactionData`](../interfaces/MintTransactionData.md)\>

Generates mint transaction to mint osTokens from chosen Vault.

#### Parameters

| Name               | Type             | Description                        |
| :----------------- | :--------------- | :--------------------------------- |
| `params`           | `Object`         | params for request                 |
| `params.shares`    | `bigint`         | Amount of osTokens to mint         |
| `params.vault`     | \`0x$\{string}\` | A vault address                    |
| `params.referrer?` | \`0x$\{string}\` | Address of the referrer. Optional. |

#### Returns

`Promise`\<[`MintTransactionData`](../interfaces/MintTransactionData.md)\>

`MintTransactionData` for transaction to sign and broadcast

---

### getMaxMintForVault

▸ **getMaxMintForVault**(`vault`): `Promise`\<`bigint`\>

Retrieves maximum amount of osTokens that can be minted by the user

#### Parameters

| Name    | Type             | Description     |
| :------ | :--------------- | :-------------- |
| `vault` | \`0x$\{string}\` | A vault address |

#### Returns

`Promise`\<`bigint`\>

Max amount of osTokens that can be minted

---

### getHealthFactorForUser

▸ **getHealthFactorForUser**(`mintedAssets`, `stakedAssets`): `Promise`\<[`OsTokenPositionHealth`](../enums/OsTokenPositionHealth.md)\>

Retrieves health factor for the user

#### Parameters

| Name           | Type     | Description                           |
| :------------- | :------- | :------------------------------------ |
| `mintedAssets` | `bigint` | Amount of osTokens minted by the user |
| `stakedAssets` | `bigint` | Amount of ETH staked by the user      |

#### Returns

`Promise`\<[`OsTokenPositionHealth`](../enums/OsTokenPositionHealth.md)\>

Position Health (enum)

---

### getStakeBalanceForUser

▸ **getStakeBalanceForUser**(`vault`): `Promise`\<`StakeBalanceReturnType`\>

Retrieves stake balance for user in the vault

#### Parameters

| Name    | Type             | Description     |
| :------ | :--------------- | :-------------- |
| `vault` | \`0x$\{string}\` | A vault address |

#### Returns

`Promise`\<`StakeBalanceReturnType`\>

-   `StakeBalanceReturnType.assets` - Balance in ETH

-   `StakeBalanceReturnType.shares` - Balance in vault tokens

---

### getOsTokenPositionForVault

▸ **getOsTokenPositionForVault**(`vault`): `Promise`\<`OsTokenPositionReturnType`\>

Retrieves osToken position for the vault

#### Parameters

| Name    | Type             | Description     |
| :------ | :--------------- | :-------------- |
| `vault` | \`0x$\{string}\` | A vault address |

#### Returns

`Promise`\<`OsTokenPositionReturnType`\>

-   `OsTokenPositionReturnType.minted`

-   `OsTokenPositionReturnType.minted.assets` - Balance in ETH

-   `OsTokenPositionReturnType.minted.shares` - Balance

-   `OsTokenPositionReturnType.minted.fee` - Usage fee amount

-   `OsTokenPositionReturnType.health` - Position Health (enum)

-   `OsTokenPositionReturnType.protocolFeePercent` - Usage fee percent

---

### getMaxUnstakeForUserForVault

▸ **getMaxUnstakeForUserForVault**(`vault`): `Promise`\<`bigint`\>

Retrieves the max amount of ETH that can be unstaked

#### Parameters

| Name    | Type             | Description     |
| :------ | :--------------- | :-------------- |
| `vault` | \`0x$\{string}\` | A vault address |

#### Returns

`Promise`\<`bigint`\>

Max amount of ETH that can be unstaked

---

### buildBurnTransaction

▸ **buildBurnTransaction**(`params`): `Promise`\<[`BurnTransactionData`](../interfaces/BurnTransactionData.md)\>

Generates burn transaction to burn osTokens from chosen Vault.

#### Parameters

| Name            | Type             | Description                |
| :-------------- | :--------------- | :------------------------- |
| `params`        | `Object`         | params for request         |
| `params.shares` | `bigint`         | Amount of osTokens to burn |
| `params.vault`  | \`0x$\{string}\` | A vault address            |

#### Returns

`Promise`\<[`BurnTransactionData`](../interfaces/BurnTransactionData.md)\>

`BurnTransactionData` for transaction to sign and broadcast
