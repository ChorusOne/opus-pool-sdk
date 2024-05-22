-   [Using Vaults with Opus Pool SDK](#using-vaults-with-opus-pool-sdk)
    -   [Option 1: Accessing Default Vault Address](#option-1-accessing-default-vault-address)
    -   [Option 2: Using Custom Vault Addresses](#option-2-using-custom-vault-addresses)
-   [Configuring wagmi in Our Application](#configuring-wagmi-in-our-application)
-   [Utilizing wagmi Hooks for Wallet Interactions](#utilizing-wagmi-hooks-for-wallet-interactions)
-   [Next Steps](#next-steps)

To begin integrating the Opus SDK into our project, the first step is to add the library to the application. You can use your favorite package manager, including npm, yarn or pnpm. For simplicity, we will use npm. In the project's root directory, run the following command:

```bash
npm install @chorus-one/opus-pool
```

Once the Opus SDK is installed, the next step is to import it into our codebase and initialize it. Here's how you can do this:

```typescript
import { OpusPool, Networks } from '@chorus-one/opus-pool';

// Currently connected user's address
const address = '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045';
const network = Networks.Holesky;

const pool = new OpusPool({
    address,
    network,
});
```

In the above snippet, we import the `OpusPool` and `Networks` from the `opus-pool` package, and we create a new `OpusPool` instance with specific parameters.

Let's break down what each parameter in the OpusPool initialization represents:

-   **`address` (Hex)**: This represents the the currently connected user's wallet address. Note that the pool solution must be re-initialized with the new user address if a different wallet is connected.

-   **`network` (Networks)**: Specifies the network to be used, which can be Holesky, Ethereum.

-   **`rpcUrl` (string, optional)**: An optional parameter specifying the RPC URL to interact with the blockchain. If not defined, a public node will be used.

With these steps, the Opus SDK is successfully integrated and initialized in our project.

## Using Vaults with Opus Pool SDK

The Opus Pool SDK offers two primary ways to engage with vaults for Ethereum staking: using predefined default vaults provided by Opus or configuring your custom vaults. Below is a guide on how to leverage each option.

### Option 1: Accessing Default Vault Address

The Opus SDK has a predefined list of default vault addresses for each supported network. These vaults are Chorus One nodes, optimized for immediate use without additional setup.

To access these default vault addresses, you can use the `getDefaultVaults` function, providing the network as an argument. This is particularly useful if you do not have specific vault addresses or prefer a quick setup.

{% hint style="info" %}

For the time being, the function returns an array containing only one default vault, regardless of the network.

{% endhint %}

You can retrieve the default vault by running:

```typescript
import { getDefaultVaults, Networks } from '@chorus-one/opus-pool';

// The network can be either Networks.Ethereum or Networks.Holesky
const network = Networks.Holesky;

const vault = getDefaultVaults(network)[0];

console.log(vault); // '0x95d0db03d59658e1af0d977ecfe142f178930ac5'
```

This function will return a list of default vault addresses, allowing us to fully leverage the capabilities of the Opus SDK in our project.

### Option 2: Using Custom Vault Addresses

The Opus Pool SDK supports this flexibility if you prefer to use custom vaults and have specific vault addresses for your project. You can configure these addresses as part of your setup, enabling you to work with vaults of your choice.

# 2. Integrating the wagmi Library

We will use the wagmi and web3modal libraries to connect with Ethereum wallets, allowing users to interact with blockchain applications. This is an essential step, particularly because the Opus SDK does not provide wallet connection functionality. Instead, the Opus SDK entirely depends on an existing wallet connection already set up and managed by your application. To get started with this process and obtain detailed instructions on installing and using both libraries, we highly recommend visiting the [wagmi][wagmi] and [web3modal][web3modal] websites.

## Configuring wagmi in Our Application

To integrate wagmi into our project, we'll start by configuring it within our main application component. This involves wrapping our application in the `WagmiProvider` component, which is responsible for providing the necessary context for wagmi's functionality.

Here’s how you can do this:

```typescript
import { WagmiProvider } from 'wagmi';
// Import the default wagmi configuration
import { config } from './config/wagmi';
import { Main } from './components/Main';

function App() {
   return (
     <WagmiProvider config={config}>
        <Main />
     </WagmiProvider>
   );
}

export default App;
```

In the above code, we import `WagmiProvider` and wrap our main application component (`<Main />`). This setup ensures that all components within `<Main />` have access to wagmi's features.

In addition, we need to set up a WalletConnect project and use the `projectId` in the wagmi config. You can get your `projectId` by creating a new project on the [WalletConnect website][walletconnect]. This step is necessary for the configuration file.

Please refer to our demo code [here][wagmi-config] for a detailed example of the wagmi configuration file.

## Utilizing wagmi Hooks for Wallet Interactions

[Wagmi][wagmi] provides a variety of hooks that make it simple to interact with user wallets and perform blockchain transactions. These hooks simplify the process of integrating web3 functionalities into our application.

Let's look at how we can use some of these hooks:

```typescript
import { useAccount, useWalletClient, usePublicClient } from 'wagmi';

// Retrieve the user's wallet address
const { address } = useAccount();

// Obtain a client to query public blockchain data
const publicClient = usePublicClient();

// Use the walletClient hook to execute transactions
const { data: walletClient } = useWalletClient();
```

In this example, `useAccount` is used to obtain the user's wallet address; the `usePublicClient` hook provides a client for querying public blockchain data. Finally, the `useWalletClient` hook provides a client for executing transactions, enabling interactions with the blockchain.

## Next Steps

In this chapter, we integrated the wagmi library into our project and configured it within our main application component. To continue with the tutorial, let's move on to the next chapter: [Fetching Vault Details][vault-details], where we will learn how to fetch and display details about the vault using the Opus Pool SDK.

[wagmi]: https://wagmi.sh
[web3modal]: https://docs.walletconnect.com/web3modal/about
[wagmi-config]: https://github.com/ChorusOne/opus-pool-demo/blob/main/src/web3/config.ts#L55
[walletconnect]: https://cloud.walletconnect.com
[vault-details]: ./2-vault-details.md
