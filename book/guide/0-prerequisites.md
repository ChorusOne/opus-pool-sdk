## Table of Contents
-   [Introduction](#introduction)
-   [Prerequisites for the OPUS Pool SDK Example](#prerequisites-for-the-opus-pool-sdk-example)
    -   [Understanding the Project Base](#understanding-the-project-base)
    -   [Recommended Knowledge](#recommended-knowledge)
    -   [Wallet Connection](#wallet-connection)
    -   [Network Configuration](#network-configuration)
-   [Next Steps](#next-steps)

## Introduction

We'll delve into the practical use of the OPUS Pool SDK for key operations like staking, unstaking, minting, burning and querying details. Drawing from an [OPUS Pool SDK Example][opus-pool-example] repository, this tutorial is a hands-on approach to understanding and leveraging the SDK's capabilities.
Please refer to the README in the repository for setup instructions and additional context.

**By the end of this tutorial, you will learn how to do the following:**

-   Learn about staking and vaults
-   Fetch and display vault details such as TVL, APY, description, and balance
-   Stake to and deposit to a vault
-   Unstake from and withdraw from a vault
-   Mint the liquid staking token osETH
-   Burn osETH to unlock staked ETH
-   Fetch and display vault transaction history
-   Retrieve and display rewards history
-   Build a simple Staking dApp that connects to MetaMask using wagmi

## Prerequisites for the OPUS Pool SDK Example

Before we dive into the core of our tutorial, it's essential to understand the prerequisites and the foundation on which we're building. This guide is centered around the OPUS Pool SDK Example. 

The repository for this example can be found [here][opus-pool-example]. 

Please review the README in the repository for instructions on installation and how to run the project. 

You can visit the [demo website](https://chorusone.github.io/opus-pool-demo/) to try out the steps you will learn in this guide staking with Opus Pool SDK. 
-   Please note that [Holesky testnet](https://github.com/eth-clients/holesky) wallet is necessary to actually stake there.
-   Source code of the demo can be found [on Github](https://github.com/chorusOne/opus-pool-demo)

### Understanding the Project Base

The OPUS Pool SDK Example is a React-based project that utilizes Vite as a bundler and leverages React Query for data management. The code is developed in TypeScript, offering type safety and an enhanced development experience. This setup provides a robust framework for integrating the OPUS Pool SDK.

### Recommended Knowledge

While an in-depth understanding of all the technologies used is beneficial, it is not necessary to follow this guide. However, we recommend familiarity with the following:

-   **Node.js (version 18) and npm (version 8)**: Essential tools for installing dependencies and running the project.
-   **MetaMask**: A popular browser extension for interacting with the Ethereum blockchain, crucial for testing our decentralized application (dApp).
-   **Basic Understanding of Ethereum and Smart Contracts**: Knowledge of how Ethereum works and the functionality of smart contracts is advantageous.
-   **JavaScript Proficiency**: As the primary language of our project, comfort with JavaScript is important.
-   **Familiarity with Ethereum Libraries**: Understanding libraries like wagmi, ethers, web3 and viem will be helpful, as they are key in managing wallet interactions and blockchain operations. In this guide, we particularly use wagmi and viem.

### Wallet Connection

It's important to note that the Opus SDK does not inherently provide wallet connection functionality. For this, we will leverage the wagmi library, which excels at managing wallet interactions and blockchain operations. 
-   You can learn more about wagmi [here][wagmi].

### Network Configuration

The SDK is compatible with the Ethereum mainnet and Holesky testnet. For the purposes of this tutorial, we use Holesky, allowing for safe experimentation without risking real assets. 
-   More information about it can be found [here][holesky]. 

Ensure that you configure your MetaMask wallet to connect to the Holesky network as instructed in the guide. Alternatively, you can use the Ethereum mainnet network, but remember to adjust the network settings in the code accordingly.

With these prerequisites, you'll be well-equipped to begin building your staking dApp with the OPUS Pool SDK. Let's embark on this journey of blockchain development!

## Next Steps

Now that you have a good understanding of the foundation, you are ready to install the OPUS Pool SDK. 

Please follow the instructions in the [Installation and Setup][installation] section to set up the SDK and prepare your development environment.

[opus-pool-example]: https://github.com/ChorusOne/opus-pool-demo
[wagmi]: https://wagmi.sh
[holesky]: https://github.com/eth-clients/holesky
[installation]: ./1-installation.md
