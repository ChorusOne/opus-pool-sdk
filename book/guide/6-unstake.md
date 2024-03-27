# 4. Unstaking Functionality

Let's say the `amountToUnstake = 10 ETH`

In order to unstake, there can be 2 scenarios:

1. The user only staked and did not mint any shares.
2. The user staked and minted shares.

In the first scenario, the unstaking process is straightforward. These are the steps:

1. determine the maximum amount the user can unstake by calling the `getMaxWithdraw` method on the OpusPool instance.

```typescript
const maxWithdraw = await pool.getMaxWithdraw(vaultAddress);
```

The user can unstake up to the `maxWithdraw` amount, i.e. `amountToUnstake <= maxWithdraw` and `0 < maxWithdraw`

2. get all the information needed to send the transaction to the blockchain by calling the `buildUnstakeTransaction` method on the OpusPool instance.

```typescript
const unstakeTx = await pool.buildUnstakeTransaction({
    vaultAddress,
    amount: amountToUnstake,
});
```

3. send the transaction to the blockchain.

```typescript
await walletClient.sendTransaction({
    account: userAddress,
    to: vaultAddress,
    data: unstakeTx.transaction,
    type: 'eip1559',
    gas: unstakeTx.gasEstimation,
    maxPriorityFeePerGas: unstakeTx.maxPriorityFeePerGas,
    maxFeePerGas: unstakeTx.maxFeePerGas,
    // Note: The value field is not set, as the user is not sending out ETH but instead receiving assets back
});
```

> In the second scenario, the user will need to burn the minted shares in order tobe able to unstake the whole staked amount. The steps are similar to the first scenario, with the addition of burning the shares before unstaking. You can learn more about the burning process [here][burn].

> ℹ️ For simplicity, we will use the same form as we did for staking. Please refer to the [Stake chapter][stake-chapter] for more details on the form setup and handling.

## Final Unstake Function

The complete function for unstaking looks similar to the staking function, with the key difference being the use of `buildUnstakeTransaction`. You can refer to the detailed code [here][unstake-usage]. Here’s a snippet illustrating the final function:

```typescript
const unstake = async ({
    userAddress, // Comes from wagmi
    walletClient, // Comes from wagmi
    network, // Networks.Holesky
    vault, // Vault address (can be provided by getDefaultVaults(...))
    amount, // Amount of ETH to withdraw, denominated in gwei
}: {
    userAddress: Hex;
    walletClient: ReturnType<typeof useWalletClient>['data'];
    network: Networks;
    vault: Hex;
    amount: bigint;
}): Promise<Hex> => {
    const pool = new OpusPool({ network, address: userAddress });
    const maxWithdraw = await pool.getMaxWithdraw(vaultAddress);

    if (maxWithdraw === 0 || maxWithdraw < amountToUnstake) {
        // the user is trying to unstake more than they can
        return;
    }

    const stakeRes = await pool.buildUnstakeTransaction({
        vault,
        amount,
    });
    const { transaction, gasEstimation, maxPriorityFeePerGas, maxFeePerGas } = stakeRes;

    await walletClient.sendTransaction({
        account: userAddress,
        to: vault,
        data: transaction,
        type: 'eip1559',
        gas: gasEstimation,
        maxPriorityFeePerGas,
        maxFeePerGas,
    });
};
```

When unstaking, we set the value field in the `sendTransaction` method to 0, which is the default. We do this because the user is not sending out ETH.

After initiating an unstake request, assets are placed into an unstake queue before they can be withdrawn. This is a safeguard to ensure the liquidity and stability of the vault. The duration an asset remains in the queue is contingent upon the validator's policies but is bound within a minimum of 24 hours and a maximum of 8.5 days. Should assets remain in the queue beyond the 8.5-day threshold, they automatically transition to a withdrawable status.

## Fetching the Unstake Queue

To view the current state of your assets within the unstake queue, you'll need to query the queue for your specific vault. This can be accomplished with the following command:

```typescript
const unstakeQueue = await pool.getUnstakeQueueForVault(vault);
```

Here, `vault` refers to the address of your vault. The returned `unstakeQueue` contains an array of objects, each representing an item within the queue. These objects are structured as follows:

- `exitQueueIndex`: (Optional) The index position of the item within the unstake queue, represented as a `bigint`.
- `positionTicket`: A unique identifier for the queue item, also a `bigint`.
- `when`: The date and time when the item was added to the queue.
- `isWithdrawable`: A boolean flag indicating whether the assets are ready to be withdrawn.
- `totalShares`: The total amount of assets in the queue item, represented in shares, as a `bigint`.
- `totalAssets`: The total amount of assets, in token units, as a `bigint`.
- `leftShares`: The amount of assets, in shares, that remain non-withdrawable, as a `bigint`.
- `leftAssets`: The amount of assets, in token units, that cannot yet be withdrawn, as a `bigint`.
- `withdrawableShares`: The portion of assets, in shares, that are eligible for withdrawal, as a `bigint`.
- `withdrawableAssets`: The portion of assets, in token units, that can be withdrawn, as a `bigint`.

Each item in the queue provides comprehensive details about the state of your unstaked assets, including their current withdrawability status and the precise amounts in both shares and token units. Monitoring these details is important for effectively managing your assets and planning your withdrawal strategy.

Once assets within the unstake queue reach a withdrawable state, users can initiate the withdrawal process to transfer these assets back into their wallet. This is done through the `buildWithdrawUnstakedTransaction` method, which prepares the transaction necessary for withdrawing the specified assets.

## Preparing the Withdrawal Transaction

To withdraw assets, you'll need to identify which queue items are ready to be withdrawn. This is achieved by filtering the items in your unstake queue to include only those marked as `isWithdrawable`. The following example demonstrates how to prepare the withdrawal transaction:

```typescript
const withdrawUnstakedTx = await pool.buildWithdrawUnstakedTransaction({
    vault: vaultAddress,
    queueItems: items.filter((item) => item.isWithdrawable),
});
```

In this snippet, `vaultAddress` refers to your vault's address, and `items` represents the array of queue items you've retrieved earlier. By filtering for `isWithdrawable` items, you ensure that only assets eligible for withdrawal are included in the transaction.

## Sending the Withdrawal Transaction

After preparing the withdrawal transaction, the next step is to send it to the blockchain. This process is similar to other transactions and can be done using the following code:

```typescript
const hash = await walletClient.sendTransaction({
    account: userAddress,
    to: vaultAddress,
    data: withdrawUnstakedTx.transaction,
    type: 'eip1559',
    gas: withdrawUnstakedTx.gasEstimation,
    maxPriorityFeePerGas: withdrawUnstakedTx.maxPriorityFeePerGas,
    maxFeePerGas: withdrawUnstakedTx.maxFeePerGas,
    chain: publicClient.chain,
});

const receipt = await publicClient.waitForTransactionReceipt({ hash });
```

Here, `walletClient` is your wallet client instance, and `userAddress` is your blockchain account address. The `sendTransaction` method includes the necessary parameters, such as the transaction type (`eip1559`), gas estimations, and the chain details.

## Claiming Your Assets

Once the transaction is successfully sent and confirmed, the specified assets are transferred from the unstake queue to your wallet. You have the flexibility to withdraw a portion or all of your withdrawable assets, depending on your needs and strategy.

## Next Steps

In this section, we learned about the functionality for unstaking in the Opus pool SDK,covering both the initiation of unstaking and the process of managing assets within the unstake queue. We explored how to initiate an unstake transaction using the `buildUnstakeTransaction` method and how to complete the unstake process by sending the transaction. We then briefly touched upon the unstake queue, where assets reside before becoming withdrawable. We outlined the process for fetching this queue and how to proceed with withdrawing assets once they're ready. Now, you can move on to the next section - [Transactions History][transactions-history], where we will learn how to fetch the stake/unstake transactions history for a given vault.

[Continue to Transactions History][transactions-history]

[get-vault-details-chapter]: ./2-vault-details.md
[stake-chapter]: ./3-stake.md
[unstake-usage]: https://github.com/ChorusOne/opus-pool-demo/blob/master/src/hooks/useUnstakeMutation.ts#L40
[transactions-history]: ./7-transactions-history.md
[burn]: ./5-burn-os-token.md
