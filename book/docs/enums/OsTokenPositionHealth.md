# Enumeration: OsTokenPositionHealth

Position health tracks the value of osETH minted by stakers relative to the value of their ETH stake in the vault.
Healthy positions have minted osETH that is well-collateralized by staked ETH. As the proportion of minted osETH
increases relative to staked ETH, position health deteriorates.

Factors affecting position health include yield discrepancies (APY) between the vault and osETH, which can result
from:
- Differences in fee structures.
- Variations in attestation performance.
- The ratio of unbounded ETH to the vault's total value locked (TVL).
- Delays in validator activation on the Beacon Chain.
- Losses due to maximal extractable value (MEV) strategies.

Risky positions may enter redemption processes, while positions deemed unhealthy are subject to liquidation.

**`See`**

[Stakewise documentation](https://docs.stakewise.io/protocol-overview-in-depth/oseth#position-health) for more details

## Enumeration Members

### Healthy

• **Healthy** = ``0``

minted osETH <= 90% of staked ETH.

___

### Moderate

• **Moderate** = ``1``

minted osETH > 90% and <= 91% of staked ETH.

___

### Risky

• **Risky** = ``2``

minted osETH > 91% and <= 92% of staked ETH.

___

### Unhealthy

• **Unhealthy** = ``3``

minted osETH > 92% of staked ETH.
