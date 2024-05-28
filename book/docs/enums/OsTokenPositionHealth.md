# Enumeration: OsTokenPositionHealth

The position health will track the value of osETH minted by stakers relative to the value of their ETH stake in the Vault.
- `Healthy`: value of minted osETH does not exceed 90% of the staked ETH value a staker has in the Vault.
- `Moderate`: value of minted osETH exceeds 90% of the staked ETH value a staker has in the Vault but remains below 91%.
- `Risky`: value of minted osETH exceeds 91% of the staked ETH value a staker has in the Vault but remains below 92%.
- `Unhealthy`: value of minted osETH exceeds 92% of the staked ETH value a staker has in the Vault.

Please reffer to the official [documentation](https://docs.stakewise.io/protocol-overview-in-depth/oseth#position-health) for more details.

## Enumeration Members

### Healthy

• **Healthy** = ``0``

___

### Moderate

• **Moderate** = ``1``

___

### Risky

• **Risky** = ``2``

___

### Unhealthy

• **Unhealthy** = ``3``
