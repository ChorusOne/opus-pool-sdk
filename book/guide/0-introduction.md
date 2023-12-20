# Introduction & Prerequisites

-   [Introduction](#introduction)
-   [Understanding Staking, Pools and Vaults](#understanding-staking-pools-and-vaults)
-   [Prerequisites for the OPUS Pool SDK Example](#prerequisites-for-the-opus-pool-sdk-example)
-   [Next Steps](#next-steps)

## Introduction

Welcome to the OPUS Pool SDK tutorial. The OPUS Pool, created by Chorus One, offers a non-custodial Ethereum pooling solution that turns ETH staking into a straightforward process. This SDK enables seamless integration with Chorus-operated pools, offering users the ability to stake any amount of ETH and start earning rewards immediately. It’s powered by StakewiseV3’s audited and secure smart contracts and leverages Chorus One's proprietary [MEV Research](https://chorus.one/categories/mev) for enhanced returns. Whether you're interested in liquid staking, automated restaking of rewards, or creating a regulated pool for specific users, this guide will walk you through leveraging the OPUS Pool SDK to its full potential.

We'll delve into the practical use of the OPUS Pool SDK for key operations like staking, unstaking, and querying vault details. Drawing from a [OPUS Pool SDK Example][opus-pool-example] repository, this tutorial is a hands-on approach to understanding and leveraging the SDK's capabilities.
Please refer to the README in the repository for setup instructions and additional context.

By the end of this tutorial, you will learn how to do the following:

-   Learn about staking and vaults
-   Fetch and display vault details such as TVL, APY, description and balance
-   Stake to deposit to a vault
-   Unstake to withdraw from a vault
-   Fetch and display staking and unstaking transactions history
-   Retrieve and display rewards history
-   Build a simple Staking dApp that connects to MetaMask using wagmi

## Understanding Staking, Pools and Vaults

### What is Staking?

Staking in the blockchain world, particularly in Ethereum, involves locking cryptocurrencies to support network operations and, in return, earning rewards. It's a key component of the Proof-of-Stake (PoS) model, which Ethereum has adopted. Stakers contribute to network security and efficiency and are compensated with additional tokens proportional to their staked amount.

### Pools: Collective Staking for Enhanced Rewards

A pool is where individual stakers combine their resources. This collective approach is beneficial for those who may not have substantial resources or technical knowledge for individual staking. Pools increase the chances of earning rewards by aggregating the staking power of multiple participants. The OPUS ecosystem offers a non-custodial pooling solution, enabling users to stake their assets while maintaining control and enjoying the benefits of pooled resources.

### Vaults: Customized Staking Pools

Vaults are isolated staking pools offering a trustless, non-custodial process for ETH deposits, reward distribution, and withdrawals. These pools operate independently, using ETH deposits solely to launch validators for that particular Vault, ensuring any rewards or penalties are confined to it. They provide a customized staking experience enabling owners to define their own staking fees, opt for a particular mix of operators, employ a unique MEV strategy and other capabilities. Governed entirely by smart contracts, each Vault caters to the specific needs of its depositors, maintaining the integrity and isolation of each staking experience.

## Prerequisites for the OPUS Pool SDK Example

Before we dive into the core of our tutorial, it's essential to understand the prerequisites and the foundation on which we're building. This guide is centered around the OPUS Pool SDK Example. The repository for this example can be found [here][opus-pool-example]. Please review the README in the repository for detailed instructions on installation and how to run the project.

### Understanding the Project Base

The OPUS Pool SDK Example is a React-based project that utilizes Vite as a bundler and leverages React Query for data management. The code is developed in TypeScript, offering type safety and an enhanced development experience. This setup provides a robust framework for integrating the OPUS Pool SDK.

### Recommended Knowledge

While an in-depth understanding of all the technologies used is beneficial, it is not necessary to follow this guide. However, we recommend familiarity with the following:

-   **Node.js (version 18) & npm (version 8)**: These are essential for installing dependencies and running the project.
-   **MetaMask**: A popular browser extension for interacting with the Ethereum blockchain, crucial for testing our decentralized application (dApp).
-   **Basic Understanding of Ethereum and Smart Contracts**: Knowledge of how Ethereum works and the functionality of smart contracts is advantageous.
-   **JavaScript Proficiency**: As the primary language of our project, comfort with JavaScript is important.
-   **Familiarity with Ethereum Libraries**: Understanding libraries like wagmi, ethers, web3 and viem will be helpful, as they are key in managing wallet interactions and blockchain operations. In this guide, we particularly use wagmi and viem.

### Wallet Connection

It's important to note that the Opus SDK does not inherently provide wallet connection functionality. For this, we will be leveraging the wagmi library, which excels at managing wallet interactions and blockchain operations. You can learn more about wagmi [here][wagmi].

### Network Configuration

The SDK is compatible with the Holesky and Ethereum mainnet networks. For the purposes of this tutorial, we will be utilizing the Holesky network. More information about it can be found [here][holesky]. Ensure that you configure your MetaMask wallet to connect to the Holesky network as instructed in the guide. Alternatively, you can use the Ethereum mainnet network, but remember to adjust the network settings in the code accordingly.

With these prerequisites in place, you're well-equipped to begin building your staking dApp with the OPUS Pool SDK. Let's embark on this journey of blockchain development!

## Next Steps

Now that you have a good understanding of the foundation, you are ready to proceed with the installation of the OPUS Pool SDK. Please follow the instructions in the [Installation and Setup][installation] section to set up the SDK and prepare your development environment.

[Continue to Installation and Setup][installation]

[opus-pool-example]: https://github.com/ChorusOne/opus-pool-demo
[wagmi]: https://wagmi.sh
[holesky]: https://github.com/eth-clients/holesky
[installation]: ./1-installation.md
