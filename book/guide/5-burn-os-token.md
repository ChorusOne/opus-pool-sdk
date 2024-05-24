## Table of Contents

-   [Overview](#overview)
-   [Determining Maximum Burnable osETH](#determining-maximum-burnable-oseth)
-   [Executing the Burning Transaction](#executing-the-burning-transaction)
-   [Next Steps](#next-steps)

## Overview

In this section, we will cover the process of burning osETH tokens using the OPUS Pool SDK. Burning osETH is essential for redeeming your staked ETH, allowing you to unlock and unstake your assets from the Vault.

We will guide you through determining the maximum amount of osETH you can burn, preparing the burn transaction, and executing it on the blockchain.

## Determining Maximum Burnable osETH

First, we need to determine the maximum amount of osETH that can be burned. This is done by calling the `getOsTokenPositionForVault` method on the `OpusPool` instance.

**Here’s a snippet illustrating this process:**

```typescript
const pool = new OpusPool({
    address,
    network,
});

const { minted } = await pool.getOsTokenPositionForVault(vault);

console.log(minted);
// {
//     assets: 2000000000000000000n, // Balance in ETH
//     shares: 1999935217534447000n, // Balance in vault units
//     fee: 125356869411916n         // Usage fee amount
}

const maxBurnable = minted.shares - minted.fee;

if (amountToBurn > maxBurnable) {
    // The user is trying to burn more than they can
    throw new Error('Burning amount exceeds the limit');
}

```

{% hint style="info" %}

When burning osETH to redeem the underlying ETH, it’s essential to account for usage fee. This 5% fee, applied to the rewards accumulated by osETH, increases the total osETH balance that must be returned to the Vault. Therefore, the maximum osETH that can be burned is calculated by subtracting the fee from the total minted shares. This ensures users only burn the amount of osETH they are entitled to, maintaining the protocol’s integrity.

{% endhint %}

## Executing the Burning Transaction

After determining the maximum amount of osETH that can be burned, proceed to build and send the burn transaction.

**Here’s how you can implement this with the `pool.buildBurnTransaction` method**

```typescript
const burnTx = await pool.buildBurnTransaction({
    vault,
    shares: amountToBurn,
});

await walletClient.sendTransaction({
    account: userAddress,
    to: vault,
    data: burnTx.transaction,
    type: 'eip1559',
    gas: burnTx.gasEstimation,
    maxPriorityFeePerGas: burnTx.maxPriorityFeePerGas,
    maxFeePerGas: burnTx.maxFeePerGas,
    // Note: The value field is not set, as the user is not sending out ETH
});
```

For an example implementation of the burning function, see the demo project [here][burn-usage].

## Next Steps

Now that you have learned how to burn osETH tokens, you are ready to dive deeper into the OPUS Pool SDK’s capabilities. Proceed to the next section to explore [Unstaking Functionality][unstake], where you will learn how to unstake your assets and withdraw them from the vault.

[unstake]: ./6-unstake.md
[burn-usage]: https://github.com/ChorusOne/opus-pool-demo/blob/main/src/hooks/useBurnMutation.ts#L49
