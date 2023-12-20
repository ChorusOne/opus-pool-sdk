# 4. Unstaking Functionality

The functionality for unstaking is similar to the staking process, with a few key differences. The primary change is in the amount you pass to the function, which in this case is the amount of funds you want to unstake and is upper-bounded by the user's balance in the vault (the balance field in the `VaultDetails` object).

To initiate an unstake transaction, you'll use the `buildUnstakeTransaction` method from the Opus pool SDK. Here's how it works:

```typescript
const stakeRes = await pool.buildUnstakeTransaction({
    vault,
    amount,
});
```

This method returns an object similar to `buildStakeTransaction` method, but with its type property set to `Unstake`.

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
        // Note: The value field is not set, as the user is not sending out ETH but instead receiving assets back
    });
};
```

When unstaking, we set the value field in the `sendTransaction` method to 0, which is the default. We do this because the user is not sending out ETH but instead receiving assets back.

Before attempting to unstake, it's important to validate that the user has sufficient funds in the vault. You can do this by using the [`getVaultDetails`][get-vault-details-chapter] method from the pool SDK. Here's a brief example:

```typescript
const [vaultDetails] = await pool.getVaultDetails([vault]); // Note: vault is the only item in the array, as we can unstake only from one vault at a time
const vaultBalance = vaultDetails.balance; // The maximum amount of funds the user can unstake
```

## Next Steps

In this section, we learned about the functionality for unstaking in the Opus pool SDK. We explored how to initiate an unstake transaction using the `buildUnstakeTransaction` method and how to complete the unstake process by sending the transaction. Now, you can move on to the next section - [Transactions History][transactions-history], where we will learn how to fetch the stake/unstake transactions history for a given vault.

[Continue to Transactions History][transactions-history]

[get-vault-details-chapter]: ./2-vault-details.md
[stake-chapter]: ./3-stake.md
[unstake-usage]: https://github.com/ChorusOne/opus-pool-demo/blob/master/src/hooks/useUnstakeMutation.ts#L40
[transactions-history]: ./5-transactions-history.md
