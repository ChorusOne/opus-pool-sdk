# 3. Minting Functionality

In order to mint, there are a couple checks that need to be done:

1. Get the max amount of shares that can be minted. You can achieve this by calling `getMaxMintForVault` on the OpusPool instance:

```typescript
let amountToMint = 100n; // the amount of shares the user wants to mint, expressed in wei
const pool = new OpusPool({ network, address: userAddress }); // userAddress is the address of the user, can be obtained from wagmi, network is the network you are on and can be Mainnet or Holesky.
const maxMint = await pool.getMaxMintForVault(vault);
if (maxMint < amountToMint) {
    // the user is trying to mint more than they can
    return;
}
```

2. Get the health of the vault. This can be achieved by calling the `getOsTokenPositionForVault` method on the OpusPool instance. You can learn more about the health of a vault [here](https://docs.stakewise.io/guides/oseth#maintaining-a-healthy-oseth-position).

```typescript
const { health } = await pool.getHealthFactorForVault(vaultAddress);
await pool.getOsTokenPositionForVault(vaultAddress);

if (health !== VaultHealth.Healthy) {
    // the vault is not healthy, the user cannot mint
    return;
}
```

3. Get the health of the vault given the amount of shares the user wants to mint. You can achieve this by calling `getHealthFactorForUser` on the OpusPool instance:

```typescript
const stakedAssets = await pool.getStakedAssetsForUser(vaultAddress); // get the current amount of assets staked
const { minted } = await pool.getOsTokenPositionForVault(vaultAddress); // get the current amount of shares minted
const newMintedAmount = mintedAmount + amountToMint;
const newHealth = await pool.getHealthFactorForUser({
    newMintedAmount,
    stakedAssets,
});
if (newHealth !== OsTokenPositionHealth.Healthy) {
    // the user is trying to mint more than they can
    return;
}
```

4. If all of the above checks pass, you can proceed to minting the shares by first calling `buildMintTransaction` on the OpusPool instance to get all the information needed to send the transaction to the blockchain:

```typescript
const mintTx = await pool.buildMintTransaction({
    vaultAddress,
    shares: amountToMint,
});
```

Then send the transaction to the blockchain

```typescript
await walletClient.sendTransaction({
    account: userAddress,
    to: vaultAddress,
    data: mintTx.transaction,
    type: 'eip1559',
    gas: mintTx.gasEstimation,
    maxPriorityFeePerGas: mintTx.maxPriorityFeePerGas,
    maxFeePerGas: mintTx.maxFeePerGas,
});
```
