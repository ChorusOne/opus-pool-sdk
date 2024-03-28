# Interface: UnstakeQueueItem

Unstake queue item. Used when retrieving the unstake queue or withdrawing from it.

## Properties

### exitQueueIndex

• `Optional` **exitQueueIndex**: `bigint`

**`Const`**

Index of the unstake queue item

___

### positionTicket

• **positionTicket**: `bigint`

**`Const`**

Unique identifier of the unstake queue item

___

### when

• **when**: `Date`

**`Const`**

Date and time when the item was added to the queue

___

### isWithdrawable

• **isWithdrawable**: `boolean`

**`Const`**

Shows if the asset is withdrawable

___

### totalShares

• **totalShares**: `bigint`

**`Const`**

Total amount of assets in shares

___

### totalAssets

• **totalAssets**: `bigint`

**`Const`**

Total amount of assets in tokens

___

### leftShares

• **leftShares**: `bigint`

**`Const`**

Amount of assets in shares that cannot be withdrawn

___

### leftAssets

• **leftAssets**: `bigint`

**`Const`**

Amount of assets in tokens that cannot be withdrawn

___

### withdrawableShares

• **withdrawableShares**: `bigint`

**`Const`**

Amount of assets in shares that can be withdrawn

___

### withdrawableAssets

• **withdrawableAssets**: `bigint`

**`Const`**

Amount of assets in tokens that can be withdrawn
