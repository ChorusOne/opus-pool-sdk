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

When unstaking, we set the value field in the `sendTransaction` method to 0, which is the default. We do this because the user is not sending out ETH but instead receiving assets back.

## Next Steps

In this section, we learned about the functionality for unstaking in the Opus pool SDK. We explored how to initiate an unstake transaction using the `buildUnstakeTransaction` method and how to complete the unstake process by sending the transaction. Now, you can move on to the next section - [Transactions History][transactions-history], where we will learn how to fetch the stake/unstake transactions history for a given vault.

[Continue to Transactions History][transactions-history]

[get-vault-details-chapter]: ./2-vault-details.md
[stake-chapter]: ./3-stake.md
[unstake-usage]: https://github.com/ChorusOne/opus-pool-demo/blob/master/src/hooks/useUnstakeMutation.ts#L40
[transactions-history]: ./7-transactions-history.md
[burn]: ./5-burn-os-token.md
