# Interface: UnstakeQueueItem

Represents an item in the unstake queue. Used for retrieving the unstake queue or withdrawing from it.

## Properties

### exitQueueIndex

• `Optional` **exitQueueIndex**: `bigint`

The index of the unstake queue item.

___

### positionTicket

• **positionTicket**: `bigint`

The unique identifier of the unstake queue item.

___

### when

• **when**: `Date`

The date and time when the item was added to the queue.

___

### isWithdrawable

• **isWithdrawable**: `boolean`

Indicates whether the asset is withdrawable.

___

### totalShares

• **totalShares**: `bigint`

The total amount of assets in shares.

___

### totalAssets

• **totalAssets**: `bigint`

The total amount of assets in ETH.

___

### leftShares

• **leftShares**: `bigint`

The amount of assets in shares that cannot be withdrawn.

___

### leftAssets

• **leftAssets**: `bigint`

The amount of assets in ETH that cannot be withdrawn.

___

### withdrawableShares

• **withdrawableShares**: `bigint`

The amount of assets in shares that can be withdrawn.

___

### withdrawableAssets

• **withdrawableAssets**: `bigint`

The amount of assets in ETH that can be withdrawn.
