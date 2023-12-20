# 1. Installation and Setup

-   [Using Vaults with Opus Pool SDK](#using-vaults-with-opus-pool-sdk)
-   [Configuring wagmi in Our Application](#configuring-wagmi-in-our-application)
-   [Utilizing wagmi Hooks for Wallet Interactions](#utilizing-wagmi-hooks-for-wallet-interactions)
-   [Next Steps](#next-steps)

To begin integrating the Opus SDK into your project, the first step is to add the library to your application. You can use your favorite package manager, including npm, yarn or pnpm. For the simplicity, we will use npm. In your project's root directory, run the following command:

```bash
npm install @chorus-one/opus-pool
```

Once the Opus SDK is installed, the next step is to import it into your codebase and initialize it. Here's how you can do this:

```typescript
import { OpusPool, Networks } from '@chorus-one/opus-pool';

const address = '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045'; // The address of the currently connected user's wallet
const network = Networks.Holesky;

const pool = new OpusPool({
    address,
    network,
});
```

In the above snippet, we import the `OpusPool` and `Networks` from the `opus-pool` package, and then we create a new `OpusPool` instance with specific parameters.

Let's break down what each parameter in the OpusPool initialization represents:

-   **`address` (Hex)**: This represents the address of the currently connected user's wallet. Note that if a different wallet is connected, the pool solution must be re-initialized with the new user address.

-   **`network` (Networks)**: Specifies the network to be used, which can be one of Holesky, Ethereum.

-   **`rpcUrl` (string, optional)**: An optional parameter for specifying the RPC URL to interact with the blockchain. If not defined, a public node will be used.

With these steps, the Opus SDK is now successfully integrated and initialized in your project.

## Using Vaults with Opus Pool SDK

The Opus Pool SDK offers two primary ways to engage with vaults for Ethereum staking: using predefined default vaults provided by Opus or configuring your custom vaults. Below is a guide on how to leverage each option.

### Option 1: Accessing Default Vault Addresses

The Opus SDK comes with a predefined list of default vault addresses for each supported network. These vaults are Chorus One nodes, optimized for immediate use without requiring additional setup.

To access these default vault addresses, you can use the `getDefaultVaults` function providing the network as argument. This is particularly useful if you do not have specific vault addresses or prefer a quick setup. You can retrieve them by running:

```typescript
import { getDefaultVaults, Networks } from '@chorus-one/opus-pool';

// The network can be either Networks.Ethereum or Networks.Holesky
const network = Networks.Holesky;

const vaults = getDefaultVaults(network);
```

This function will return a list of default vault addresses, allowing you to fully leverage the capabilities of the Opus SDK in your project.

### Option 2: Using Custom Vault Addresses

If you prefer to use custom vaults or have specific vault addresses for your project, the Opus SDK supports this flexibility. You can configure these addresses as part of your SDK setup, enabling you to work with vaults of your choice.

For setting up custom vaults, ensure you have the vault addresses ready.

# 2. Integrating the wagmi Library

We are going to use the wagmi and web3modal libraries to connect with Ethereum wallets, which will allow users to interact with blockchain applications. This is a crucial step, particularly because the Opus SDK does not provide wallet connection functionality on its own. Instead, the Opus SDK entirely depends on an existing wallet connection already set up and managed by your application. To get started with this process and obtain detailed instructions on how to install and use both libraries, we highly recommend visiting the [wagmi][wagmi] and [web3modal][web3modal] websites.

## Configuring wagmi in Our Application

To integrate wagmi into our project, we'll start by configuring it within our main application component. This involves wrapping our application in the `WagmiConfig` component, which is responsible for providing the necessary context for wagmi's functionality.

Here’s how you can do this:

```typescript
import { WagmiConfig } from 'wagmi';
import { config } from './config/wagmi';
import { Main } from './components/Main';

function App() {
   return (
     <WagmiConfig config={config}>
        <Main />
     </WagmiConfig>
   );
}

export default App;
```

In the above code, we import `WagmiConfig` and wrap our main application component (`<Main />`) in it. This setup ensures that all components within `<Main />` have access to wagmi's features.

In addition, we need to setup a WalletConnect project and use the `projectId` in the wagmi config. You can get your `projectId` by creating a new project on the [WalletConnect website][walletconnect].

## Utilizing wagmi Hooks for Wallet Interactions

[Wagmi][wagmi] provides a variety of hooks that make it simple to interact with user wallets and perform blockchain transactions. These hooks are a key part of our integration, enabling us to build a more interactive and user-friendly application.

Let's look at how we can use some of these hooks:

```typescript
import { useAccount, useWalletClient } from 'wagmi';

// Retrieve the user's wallet address
const { address } = useAccount();

// Use the walletClient hook to execute transactions
const { data: walletClient } = useWalletClient();
```

In this example, `useAccount` is used to obtain the user's wallet address, which is fundamental for identifying users in blockchain transactions. The `useWalletClient` hook, on the other hand, provides us with a client that can be used to execute transactions.

## Next Steps

In this section, we integrated the wagmi library into our project and configured it within our main application component. To continue with the tutorial, let's move on to the next section: [Fetching Vault Details][vault-details]. In the Vault Details section, we will learn how to fetch and display details about the vaults using the Opus Pool SDK.

[Continue to Fetching Vault Details][vault-details]

[wagmi]: https://wagmi.sh
[web3modal]: https://docs.walletconnect.com/web3modal/about
[walletconnect]: https://cloud.walletconnect.com
[vault-details]: ./2-vault-details.md
