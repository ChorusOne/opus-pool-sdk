## 8. Burn OS Token

In this section, we will learn about the burning process for the Opus pool SDK. The burning process is used to destroy the minted shares and receive the underlying assets back. This process is required if the user minted a portion or the entire staked amount and now wants to unstake. You can learn more about staking [here][stake] and unstaking [here][unstake].

The steps to burn osETH are as follows:

1. Obtain the maximum amount of shares the user can burn. This can be achieved by calling the `getOsTokenPositionForVault` method on the OpusPool instance. You can learn more about the health of a vault [here](https://docs.stakewise.io/guides/oseth#maintaining-a-healthy-oseth-position).

```typescript
const { minted } = await pool.getOsTokenPositionForVault(vaultAddress);
const maxBurnable = minted.shares - minted.fee;
if (maxBurnable === 0) {
    // there are no shares to burn
    return;
}
```

2. Proceed to burning the shares by first calling `buildBurnTransaction` on the OpusPool instance to get all the information needed to send the transaction to the blockchain:

```typescript
const amountToBurn = 1n;
if (amountToBurn > maxBurnable) {
    // the user is trying to burn more than they can
    return;
}
const burnTx = await pool.buildBurnTransaction({
    vaultAddress,
    shares: amountToBurn,
});
```

Then send the transaction to the blockchain

```typescript
await walletClient.sendTransaction({
    account: userAddress,
    to: vaultAddress,
    data: burnTx.transaction,
    type: 'eip1559',
    gas: burnTx.gasEstimation,
    maxPriorityFeePerGas: burnTx.maxPriorityFeePerGas,
    maxFeePerGas: burnTx.maxFeePerGas,
});
```

## Next Steps

In this section, we focused on the core functionality of our application, which is submitting a burning transaction. To continue exploring the functionality of our application, you can proceed to the next section: [Unstaking Functionality][unstake].

[stake]: ./3-stake.md
[unstake]: ./6-unstake.md
