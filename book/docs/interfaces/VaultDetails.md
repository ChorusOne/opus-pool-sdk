# Interface: VaultDetails

Provides details about a specific vault in the system.

## Properties

### address

• **address**: \`0x$\{string}\`

The address of the vault.

___

### name

• **name**: `string`

A human-readable string identifier for the vault.

___

### description

• **description**: `string`

A description of the vault.

___

### logoUrl

• **logoUrl**: `string`

The URL of the vault's logo, which can be displayed in the UI.

___

### tvl

• **tvl**: `bigint`

The total value of assets locked in the vault, denominated in wei.

___

### apy

• **apy**: `number`

The average annual yield percentage for the vault, based on historical data.

___

### balance

• **balance**: `bigint`

The current balance of the connected address in the vault, denominated in wei.
