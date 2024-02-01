# Enumeration: OsTokenPositionHealth

The position health will track the value of osETH minted by stakers relative to the value of their ETH stake in the Vault.
- `Unhealthy`: value of minted osETH exceeds 92% of the staked ETH value a staker has in the Vault.
- `Moderate`: value of minted osETH exceeds 90% of the staked ETH value a staker has in the Vault but remains below 91%.
- `Healthy`: value of minted osETH does not exceed 90% of the staked ETH value a staker has in the Vault.
- `Risky`: value of minted osETH exceeds 91% of the staked ETH value a staker has in the Vault but remains below 92%.

Please reffer to the official [documentation](https://docs.stakewise.io/protocol-overview-in-depth/oseth#position-health) for more details.

## Enumeration Members

### Unhealthy

• **Unhealthy** = ``0``

___

### Moderate

• **Moderate** = ``1``

___

### Healthy

• **Healthy** = ``2``

___

### Risky

• **Risky** = ``3``
