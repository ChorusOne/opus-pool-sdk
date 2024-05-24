## Table of Contents

-   [Overview](#overview)
-   [Determining Unstaking Limits](#determining-unstaking-limits)
-   [Sending the Unstake Transaction](#sending-the-unstake-transaction)
-   [Fetching the Unstake Queue](#fetching-the-unstake-queue)
-   [Preparing the Withdrawal Transaction](#preparing-the-withdrawal-transaction)
-   [Sending the Withdrawal Transaction](#sending-the-withdrawal-transaction)
-   [Next Steps](#next-steps)

## Overview

With the OPUS Pool SDK, users can unstake their ETH from a Vault, regaining asset control. Users are placed in an exit queue where they continue to earn rewards, and then they can claim the staked ETH.

This section covers the entire process, from unstaking request initiation to handling the exit queue and withdrawing your ETH.

{% hint style="info" %}

We will use the same form as we did for staking for simplicity. This form allows users to input the amount of ETH and submit.

Please refer to the [Staking Functionality][stake-section] section for more details.

{% endhint %}

## Determining Unstaking Limits

To begin, we need to establish the maximum amount that the user is permitted to unstake. This is achieved by invoking the `getMaxUnstakeForUserForVault` method on the `OpusPool` instance.

**Here’s how you can implement it:**

```typescript
const pool = new OpusPool({
    address,
    network,
});

const maxUnstake = await pool.getMaxUnstakeForUserForVault(vault);

console.log(maxUnstake); // 1000000000000000000n

if (amountToUnstake > maxUnstake) {
    // The user is trying to unstake more than they can
    throw new Error('Unstaking amount exceeds the limit');
}
```

{% hint style="warning" %}

To unstake your entire ETH amount, you may need to burn your osETH tokens first. Burning osETH reclaims the underlying staked ETH. For detailed steps, see the [Burning osETH section][burn].

{% endhint %}

## Sending the Unstake Transaction

Once you’ve determined the maximum unstakeable amount, you can proceed to build and send the unstake transaction.

**The following example demonstrates how to use the `pool.buildUnstakeTransaction` method:**

```typescript
const unstakeTx = await pool.buildUnstakeTransaction({
    vault,
    amount: amountToUnstake,
});

await walletClient.sendTransaction({
    account: userAddress,
    to: vault,
    data: unstakeTx.transaction,
    type: 'eip1559',
    gas: unstakeTx.gasEstimation,
    maxPriorityFeePerGas: unstakeTx.maxPriorityFeePerGas,
    maxFeePerGas: unstakeTx.maxFeePerGas,
    // Note: The value field is not set, as the user is not sending out ETH
});
```

You can find an example of the unstaking function in the demo project implementation [here][unstake-usage].

After initiating an unstake request, assets are placed into an unstake queue before being withdrawn. This is a safeguard to ensure the liquidity and stability of the vault. The duration an asset remains in the queue is contingent upon the validator’s policies and the state of the vault.

## Fetching the Unstake Queue

To view the current state of your assets within the unstake queue, you’ll need to query the queue for your specific vault.

**This can be accomplished with the following command:**

```typescript
const unstakeQueue = await pool.getUnstakeQueueForVault(vault);

console.log(unstakeQueue);
// [
//   {
//     exitQueueIndex: 64n,
//     positionTicket: 200565792007826595508n,
//     when: 2024-05-08T20:11:24.000Z,
//     isWithdrawable: true,
//     totalShares: 9966734055972798n,
//     totalAssets: 10000599708353479n,
//     leftShares: 0n,
//     leftAssets: 0n,
//     withdrawableShares: 9966734055972798n,
//     withdrawableAssets: 10000014138234276n
//   ]
// }
```

Here, `vault` refers to the address of your vault. The returned `unstakeQueue` contains an array of objects, each representing an item within the queue. These objects are structured as follows:

-   **`exitQueueIndex` (bigint)**: The index position of the item within the unstake queue.
-   **`positionTicket`(bigint)**: A unique identifier for the queue item.
-   **`when` (Date)**: The date and time when the item was added to the queue.
-   **`isWithdrawable` (boolean)**: A flag indicating whether the assets are ready to be withdrawn.
-   **`totalShares` (bigint)**: The total amount of assets in the queue item, represented in shares.
-   **`totalAssets` (bigint)**: The total amount of assets, in token units.
-   **`leftShares` (bigint)**: The amount of assets, in shares, that remain non-withdrawable.
-   **`leftAssets` (bigint)**: The amount of assets, in token units, that cannot yet be withdrawn.
-   **`withdrawableShares` (bigint)**: The portion of assets, in shares, that are eligible for withdrawal.
-   **`withdrawableAssets` (bigint)**: The portion of assets, in token units, that can be withdrawn.

Each item in the queue provides details about the state of your unstaked assets, including their current withdrawability status and the precise amounts in both shares and token units.

Once assets within the unstake queue reach a withdrawable state, users can initiate the withdrawal process to transfer them back into their wallets. This is done through the `buildWithdrawUnstakedTransaction` method, which prepares the transaction necessary for withdrawing the specified assets.

## Preparing the Withdrawal Transaction

To withdraw assets, you’ll need to identify which queue items are ready to be withdrawn. This is achieved by filtering the items in your unstake queue to include only those marked as `isWithdrawable`.

**The following example demonstrates how to prepare the withdrawal transaction:**

```typescript
const withdrawUnstakedTx = await pool.buildWithdrawUnstakedTransaction({
    vault,
    queueItems: items.filter((item) => item.isWithdrawable),
});
```

In this snippet, `vault` refers to your vault’s address, and `items` represents the queue items you’ve retrieved earlier. By filtering for `isWithdrawable` items, you ensure that only assets eligible for withdrawal are included in the transaction.

## Sending the Withdrawal Transaction

After preparing the withdrawal transaction, the next step is to send it to the blockchain.

**This process is similar to other transactions and can be done using the following code:**

```typescript
const hash = await walletClient.sendTransaction({
    account: userAddress,
    to: vault,
    data: withdrawUnstakedTx.transaction,
    type: 'eip1559',
    gas: withdrawUnstakedTx.gasEstimation,
    maxPriorityFeePerGas: withdrawUnstakedTx.maxPriorityFeePerGas,
    maxFeePerGas: withdrawUnstakedTx.maxFeePerGas,
    chain: publicClient.chain,
    // Note: The value field is not set, as the user is not sending out ETH
});
```

{% hint style="success" %}

Once the transaction is successfully sent and confirmed, the specified assets are transferred from the unstake queue to your wallet. Depending on your needs and strategy, you can withdraw a portion or all of your withdrawable assets.

{% endhint %}

## Next Steps

In this section, we learned about the functionality for unstaking in the OPUS Pool SDK, covering both the initiation of unstaking and the process of managing assets within the unstake queue.

Now, you are ready to move on to the next section — [Minting osETH][mint].

[stake-section]: ./3-stake.md
[unstake-usage]: https://github.com/ChorusOne/opus-pool-demo/blob/main/src/hooks/useUnstakeMutation.ts#L49
[mint]: ./5-mint-os-token.md
[burn]: ./6-burn-os-token.md
