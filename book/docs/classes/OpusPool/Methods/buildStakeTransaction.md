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