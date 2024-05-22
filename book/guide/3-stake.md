-   [The Form Component](#the-form-component)
-   [Writing the Staking Transaction Function](#writing-the-staking-transaction-function)
-   [Next Steps](#next-steps)

We will start by creating a basic form to integrate staking functionality into your application.. This form will consist of an input field for the amount to be staked and a button to submit the transaction. Below is a basic implementation of this form in React:

## The Form Component

```typescript
import React, { useState } from 'react';
import { useAccount, useBalance } from 'wagmi';

export const FormComponent = ({ onSubmit }) => {
   const { address } = useAccount();
   const { data: balance } = useBalance({
     address,
   });
   const [inputValue, setInputValue] = useState('');

   return (
     <div>
        <form onSubmit={(e) => {
           e.preventDefault();
           onSubmit(inputValue);
           setInputValue('');
        }}>
           <input
             type="text"
             placeholder="ETH amount"
             onChange={(e) => setInputValue(e.target.value)}
             value={inputValue}
           />
           <span>ETH</span>
           <div>Available to stake: {balance?.formatted} ETH</div>
           <button type="submit">Submit</button>
        </form>
     </div>
   );
};
```

This form component uses the `useAccount` and `useBalance` hooks from `wagmi` to manage user account details and balance information. The `onSubmit` prop is a function that handles the actual staking process, which you can define in your application logic.

For a more comprehensive implementation, which includes error handling, loading states, and styling, refer to our [extended version][stake-ui], which is available in the codebase.

This simple yet effective form provides the basic functionality to integrate staking into your Ethereum-based application.

![Stake form](../media/stake.png)

## Writing the Staking Transaction Function

Now, we will focus on the core functionality of our application: submitting a staking transaction. The complete code for this can be found [here][stake-usage]. Here is a representative snippet of the function:

```typescript
const stake = async ({
    userAddress, // Comes from wagmi
    walletClient, // Comes from wagmi
    network, // Networks.Holesky
    vault, // Vault address (can be provided by getDefaultVaults(...))
    amount, // Amount of ETH to deposit, denominated in wei
}: {
    userAddress: Hex;
    walletClient: ReturnType<typeof useWalletClient>['data'];
    network: Networks;
    vault: Hex;
    amount: bigint;
}): Promise<Hex> => {
    const pool = new OpusPool({ network, address: userAddress });

    const stakeRes = await pool.buildStakeTransaction({
        vault,
        amount,
    });

    console.log(stakeRes);
    // {
    //   transaction: "0x...",
    //   amount: 10000000000000000n,
    //   gasEstimation: 130005n,
    //   maxFeePerGas: 8712673530n,
    //   maxPriorityFeePerGas: 220000000n
    // }

    const { transaction, gasEstimation, maxPriorityFeePerGas, maxFeePerGas } = stakeRes;

    await walletClient.sendTransaction({
        account: userAddress,
        to: vault,
        data: transaction,
        value: amount,
        type: 'eip1559',
        gas: gasEstimation,
        maxPriorityFeePerGas,
        maxFeePerGas,
    });
};
```

{% hint style="info" %}

This function utilizes the Ethereum Improvement Proposal 1559 (EIP-1559) transaction type. With EIP-1559, users specify two types of fees:

-   **`maxFeePerGas`**: The maximum fee per gas the user is willing to pay. This includes the base fee and the priority fee.
-   **`maxPriorityFeePerGas`**: Also known as the tip, this incentivizes miners to prioritize the transaction.

The network determines the actual fee based on the current demand for block space and the transaction’s priority. Fortunately, the Opus Pool SDK provides gas estimation, simplifying the process.

{% endhint %}

The `StakeTransactionData` object returned by `buildStakeTransaction` includes the following parameters:

-   **`transaction` (Hex)**: A contract hashed method call with encoded arguments (the transformation of the method call into this encoded and hashed form is handled by the `encodeFunctionData` method from the `viem` library).
-   **`amount` (bigint)**: The amount of ETH being staked
-   **`gasEstimation` (bigint)**: The estimated gas required for the transaction.
-   **`maxPriorityFeePerGas` (bigint)**: The maximum priority fee per gas (in wei).
-   **`maxFeePerGas` (bigint)**: The total fee per gas (in wei), inclusive of the `maxPriorityFeePerGas`.

## Next Steps

This section focused on our application’s core functionality: submitting a staking transaction. It utilizes the Ethereum Improvement Proposal 1559 (EIP-1559) transaction type and the Opus Pool SDK for gas estimation. To continue exploring our application’s functionality, you can proceed to the next section: [minting functionality][mint].

[stake-ui]: https://github.com/ChorusOne/opus-pool-demo/blob/master/src/components/FormComponent.tsx#L8
[stake-usage]: https://github.com/ChorusOne/opus-pool-demo/blob/main/src/hooks/useStakeMutation.ts#L49
[mint]: ./4-mint-os-token.md
