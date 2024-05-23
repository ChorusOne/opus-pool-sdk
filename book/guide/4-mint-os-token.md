## Table of Contents

-   [Table of Contents](#table-of-contents)
-   [Overview](#overview)
-   [Checking Minting Limits](#checking-minting-limits)
-   [Calculating Health Factor for Minting](#calculating-health-factor-for-minting)
-   [Executing the Minting Transaction](#executing-the-minting-transaction)
-   [Next Steps](#next-steps)

## Overview

Minting liquid staking tokens (osETH) allows users to maintain liquidity while staking their ETH.

In this section, we will guide you through checking minting limits, assessing vault health, and building and submitting minting transactions.

{% hint style="info" %}

We will use the same form as we did for staking for simplicity. This form allows users to input the amount of ETH and submit.

Please refer to the [Staking Functionality][stake-chapter] chapter for more details.

{% endhint %}

## Checking Minting Limits

Before minting, we need to check the maximum amount of shares that can be minted.

**This can be done using the** `getMaxMintForVault` **method:**

```typescript
const pool = new OpusPool({
    address,
    network,
});

const maxMint = await pool.getMaxMintForVault(vault);

console.log(maxMint); // 1000000000000000000n

if (maxMint < amountToMint) {
    // The user is trying to mint more than they can
    throw new Error('Minting amount exceeds the limit');
}
```

## Calculating Health Factor for Minting

After confirming the minting limits, the next step is to assess the health factor of the vault. This involves evaluating the vault's health given the amount of shares the user intends to mint.

**Use the** `getHealthFactorForUser` **method:**

```typescript
// Import health factor enum
import { OsTokenPositionHealth } from '@chorus-one/opus-pool';

// Get the current amount of staked assets
const stakedBalance = await pool.getStakeBalanceForUser(vault);

console.log(stakedBalance);
// {
//     assets: 1000000000000000000n, - Balance in ETH
//     shares: 999967608767223548n  - Balance in vault units
// }

// Get the current amount of minted assets
const { minted } = await pool.getOsTokenPositionForVault(vault);

console.log(minted);
// {
//     assets: 2000000000000000000n, - Balance in ETH
//     shares: 1999935217534447000n  - Balance in vault units
//     fee: 125356869411916n         - Usage fee amount
// }

const nextMintedAssets = minted.assets + amountToMint;

const nextHealth = await pool.getHealthFactorForUser(nextMintedAssets, stakedBalance.assets);

console.log(nextHealth); // 2 - OsTokenPositionHealth.Healthy

if (nextHealth !== OsTokenPositionHealth.Healthy) {
    // The vault will be unhealthy after minting
    throw new Error('Vault will be unhealthy after minting');
}
```

The `getHealthFactorForUser` method calculates the vault's health factor based on the current and intended minting amounts, ensuring the vault remains in a healthy state post-minting.

{% hint style="info" %}

The position health parameter is used to monitor the value of minted osETH relative to the staked ETH value:

-   **`OsTokenPositionHealth.Healthy`**: Minted osETH ≤ 90% of staked ETH
-   **`OsTokenPositionHealth.Moderate`**: Minted osETH > 90% but ≤ 91% of staked ETH
-   **`OsTokenPositionHealth.Risky`**: Minted osETH > 91% but ≤ 92% of staked ETH
-   **`OsTokenPositionHealth.Unhealthy`**: Minted osETH > 92% of staked ETH

Changes in position health can result from discrepancies between Vault APY and osETH APY, higher fees, inconsistent performance, or MEV theft.

Unhealthy positions may lead to forced burning of osETH tokens.

{% endhint %}

## Executing the Minting Transaction

If the minting limits and health factors are within acceptable ranges, you can proceed to minting the shares.

**To illustrate this, we use the `pool.buildMintTransaction` method in the following example:**

```typescript
const mintTx = await pool.buildMintTransaction({
    vault,
    shares: amountToMint,
});

await walletClient.sendTransaction({
    account: userAddress,
    to: vault,
    data: mintTx.transaction,
    type: 'eip1559',
    gas: mintTx.gasEstimation,
    maxPriorityFeePerGas: mintTx.maxPriorityFeePerGas,
    maxFeePerGas: mintTx.maxFeePerGas,
    // Note: The value field is not set, as the user is not sending out ETH
});
```

For your implementation of the minting function, refer to the demo project implementation [here][mint-usage]

## Next Steps

In this chapter, we covered the essential steps for minting osETH tokens, including checking minting limits, calculating the health factor, and executing the minting transaction.

To continue exploring the capabilities of your application, proceed to the next chapter: [Burning Functionality][burn].

[burn]: ./5-burn-os-token.md
[stake-chapter]: ./3-stake.md
[mint-usage]: https://github.com/ChorusOne/opus-pool-demo/blob/main/src/hooks/useMintMutation.ts#L48
