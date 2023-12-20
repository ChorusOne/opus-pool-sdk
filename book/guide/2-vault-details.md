# 2. Fetching Vault Details

-   [Initializing the Pool and Fetching Vault Details](#initializing-the-pool-and-fetching-vault-details)
-   [Displaying Vault Details as a Table](#displaying-vault-details-as-a-table)
-   [Next Steps](#next-steps)

In this chapter, we will explore how to fetch and display details of various vaults using the Opus SDK. This process involves initializing the pool, fetching the vault details, and then presenting them in a user-friendly format.

## Initializing the Pool and Fetching Vault Details

First, we start by initializing the pool in the same way we did previously. Then, we use the `getVaultDetails` method to fetch details about the vaults. You can refer to the detailed code for this process [here][get-vault-details-usage]. Here’s a snippet illustrating this process:

```typescript
const pool = new OpusPool({
    address, // Provided by wagmi
    network, // Networks.Holesky
});

const vaults = getDefaultVaults(network);
// Alternatively, you can define vaults yourself:
// const vaults = ['0x...', '0x...'];

const vaultData = await pool.getVaultDetails(vaults);
```

Each parameter of the `VaultDetails` object returned by `getVaultDetails` has a specific purpose:

-   `address`: The hexadecimal address of the Vault.
-   `name`: A human-readable identifier for the Vault.
-   `description`: A description of the Vault as set by Chorus One.
-   `logoUrl`: The URL of the Vault's logo for UI display.
-   `tvl`: The total value of assets locked in the Vault, expressed in Gwei.
-   `apy`: The average yield percentage, derived from historical data.
-   `balance`: The current balance of the connected address in the Vault.

## Displaying Vault Details as a Table

Now, let's display these vault details in a table format in the UI. The following code snippet, which you can find [here][get-vault-details-ui], demonstrates how to achieve this:

```typescript
import { formatEther } from 'viem';
import { VaultDetails } from '@chorus-one/opus-pool';

const Vault = ({ vaultData }: { vaultData: VaultDetails[] }) => {
   return (
     <table>
        <thead>
           <tr>
             <th>Vault name</th>
             <th>Description</th>
             <th>APY</th>
             <th>TVL</th>
             <th>Current balance</th>
           </tr>
        </thead>
        <tbody>
           {vaultData.map((vault: VaultDetails) => (
             <tr key={vault.name}>
                <td>{vault.name}</td>
                <td>{vault.description}</td>
                <td>{vault.apy * 100} %</td>
                <td>{Number(formatEther(vault.tvl)).toLocaleString()} ETH</td>
                <td>{Number(formatEther(vault.balance)).toLocaleString()} ETH</td>
             </tr>
           ))}
        </tbody>
     </table>
   );
};
```

Once rendered, the vault details will be displayed in an informative table on the screen, showcasing key information such as vault name, APY, and balances in a user-friendly format:

![Vault details](../media/vaultDetails.png)

## Next Steps

In this chapter, we learned how to fetch and display details of various vaults using the Opus SDK. To continue exploring the functionality of the Opus SDK, you can proceed to the next section: [Staking Functionality][stake]. In the next section, we will learn how to stake assets to the vault.

[Continue to Staking Functionality][stake]

[get-vault-details-usage]: https://github.com/ChorusOne/opus-pool-demo/blob/master/src/hooks/useVaultDetails.ts#L21
[get-vault-details-ui]: https://github.com/ChorusOne/opus-pool-demo/blob/master/src/components/Vault.tsx#L35
[stake]: ./3-stake.md
