# Interface: VaultTransaction

Represents a transaction history data point for a vault.

## Properties

### vault

• **vault**: \`0x$\{string}\`

The address of the vault that was interacted with.

___

### when

• **when**: `Date`

The date and time when the vault transaction occurred.

___

### type

• **type**: [`VaultActionType`](../enums/VaultActionType.md)

The type of vault transaction.

___

### amount

• **amount**: `bigint`

The amount of ETH transacted, denominated in wei.

___

### hash

• **hash**: `string`

The hash of the transaction.
