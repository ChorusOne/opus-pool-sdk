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