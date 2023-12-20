# Interface: StakingTransactionData

A transaction for either stake or unstake

## Properties

### type

• **type**: [`StakingTypeEnum`](../enums/StakingTypeEnum.md)

**`Const`**

"Stake" or "Unstake"

___

### transaction

• **transaction**: \`0x$\{string}\`

**`Const`**

Hex-encoded transaction call data

___

### gasEstimation

• **gasEstimation**: `bigint`

**`Const`**

Gas estimation

___

### amount

• `Optional` **amount**: `bigint`

**`Const`**

Amount of the ETH staked or unstaked

___

### maxPriorityFeePerGas

• **maxPriorityFeePerGas**: `bigint`

**`Const`**

Max priority fee per gas to use for network

___

### maxFeePerGas

• **maxFeePerGas**: `bigint`

**`Const`**

Max fee per gas to use for network
