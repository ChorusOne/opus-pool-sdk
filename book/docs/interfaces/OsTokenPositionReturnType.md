# Interface: OsTokenPositionReturnType

Represents the osToken position of a staker in the vault.

## Properties

### minted

• **minted**: `Object`

Contains details about the minted osETH

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `assets` | `bigint` | Total amount of osETH minted |
| `shares` | `bigint` | Corresponding shares of the pooled ETH represented as minted osETH. |
| `fee` | `bigint` | Fee incurred during the minting process, calculated based on the shares of osETH minted. |

___

### health

• **health**: [`OsTokenPositionHealth`](../enums/OsTokenPositionHealth.md)

The health status of the osETH position, determining the risk based on collateralization.

___

### protocolFeePercent

• **protocolFeePercent**: `bigint`

Protocol fee percentage on the rewards accumulated in osETH.
