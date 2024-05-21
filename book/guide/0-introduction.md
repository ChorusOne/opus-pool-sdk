# Introduction & Prerequisites

-   [Introduction](#introduction)
-   [Understanding Key Concepts](#understanding-key-concepts)
-   [Prerequisites for the OPUS Pool SDK Example](#prerequisites-for-the-opus-pool-sdk-example)
    -   [Understanding the Project Base](#understanding-the-project-base)
    -   [Recommended Knowledge](#recommended-knowledge)
    -   [Wallet Connection](#wallet-connection)
    -   [Network Configuration](#network-configuration)
-   [Next Steps](#next-steps)

## Introduction

Welcome to the OPUS Pool SDK tutorial. The OPUS Pool, created by Chorus One, offers a non-custodial Ethereum pooling solution that turns ETH staking into a straightforward process. This SDK enables easy integration with pools, including those operated by Chorus One, allowing users to stake any amount of ETH and start earning rewards immediately. It’s powered by StakewiseV3’s audited and secure smart contracts and leverages Chorus One's proprietary [MEV Research](https://chorus.one/categories/mev) for enhanced returns. Whether you're interested in liquid staking, automated restaking of rewards, or creating a regulated pool for specific users, this guide will walk you through leveraging the OPUS Pool SDK to its full potential.

We'll delve into the practical use of the OPUS Pool SDK for key operations like staking, unstaking, minting, burning and querying details. Drawing from an [OPUS Pool SDK Example][opus-pool-example] repository, this tutorial is a hands-on approach to understanding and leveraging the SDK's capabilities.
Please refer to the README in the repository for setup instructions and additional context.

By the end of this tutorial, you will learn how to do the following:

-   Learn about staking and vaults
-   Fetch and display vault details such as TVL, APY, description, and balance
-   Stake to deposit to a vault
-   Unstake to withdraw from a vault
-   Mint liquid staking token osETH
-   Burn osETH to unlock staked ETH
-   Fetch and display vault transactions history
-   Retrieve and display rewards history
-   Build a simple Staking dApp that connects to MetaMask using wagmi

## Understanding Key Concepts

<details>
<summary>
📥  What is Staking?
</summary>

Staking in the blockchain world, particularly in Ethereum, involves locking cryptocurrencies to support network operations and, in return, earning rewards. It's a key component of the Proof-of-Stake (PoS) model, which Ethereum has adopted. Stakers contribute to network security and efficiency and are compensated with additional tokens proportional to their staked amount.

</details>
<details>
<summary>
🏦  Pools: Collective Staking for Enhanced Rewards
</summary>

A pool is where individual stakers combine their resources. This collective approach benefits those who may not have substantial resources or technical knowledge for individual staking. Pools increase the chances of earning rewards by aggregating the staking power of multiple participants. The OPUS ecosystem offers a non-custodial pooling solution, enabling users to stake their assets while maintaining control and enjoying the benefits of pooled resources.

</details>
<details>
<summary>
🏰  Vaults: Customized Staking Pools
</summary>

Vaults are isolated staking pools offering a trustless, non-custodial process for ETH deposits, reward distribution, and withdrawals. These pools operate independently, using ETH deposits solely to launch validators for that particular Vault, ensuring any rewards or penalties are confined to it. They provide a customized staking experience enabling owners to define their staking fees, opt for a particular mix of operators, employ a unique MEV strategy and other capabilities. Governed entirely by smart contracts, each Vault caters to the specific needs of its depositors, maintaining the integrity and isolation of each staking experience.

</details>
<details>
<summary>
🪙  Minting osETH: Creating Liquid Staking Tokens
</summary>

Minting osETH involves converting staked ETH in Vaults into liquid staking tokens. This process enables stakers to utilize their assets in the DeFi ecosystem without losing staking rewards. By minting osETH, users can maintain liquidity and flexibility while contributing to network security. The amount of osETH that can be minted is determined by the staked ETH value, current exchange rate, and a 90% minting threshold set by the StakeWise DAO. This ensures that osETH remains overcollateralized, providing robust backing and value stability.

</details>
<details>
<summary>
🔥  Burning osETH: Redeeming Staked ETH
</summary>

Burning osETH is destroying osETH tokens to reclaim the underlying staked ETH. When users wish to unstake their ETH, they must return the minted osETH, which is then burned. This reduces the total supply of osETH and unlocks the corresponding staked ETH. During this process, a 5% commission on the rewards accumulated by osETH is automatically deducted, ensuring the integrity of the staking process. This novel commission structure helps maintain osETH’s value and ensures it remains fully backed by staked ETH.

</details>
<details>
<summary>
📤  Unstaking: Reclaiming Your ETH
</summary>

Unstaking allows users to withdraw their staked ETH from a Vault, stopping the accrual of staking rewards and regaining control over their assets. The process begins with the user initiating an unstaking request, which uses available unbonded ETH in the Vault to fulfill it. If there isn't enough unbonded ETH, a sufficient number of Vault validators will be exited to provide the necessary ETH. This process can take time, so users are placed in an exit queue until the validators are exited. While in the exit queue, users continue to earn staking rewards. Once the exit is complete, users can claim their unstaked ETH at any time.

</details>

## Prerequisites for the OPUS Pool SDK Example

Before we dive into the core of our tutorial, it's essential to understand the prerequisites and the foundation on which we're building. This guide is centered around the OPUS Pool SDK Example. The repository for this example can be found [here][opus-pool-example]. Please review the README in the repository for detailed instructions on installation and how to run the project.

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

It's important to note that the Opus SDK does not inherently provide wallet connection functionality. For this, we will leverage the wagmi library, which excels at managing wallet interactions and blockchain operations. You can learn more about wagmi [here][wagmi].

### Network Configuration

The SDK is compatible with the Ethereum mainnet and Holesky testnet. For the purposes of this tutorial, we use Holesky, allowing for safe experimentation without risking real assets. More information about it can be found [here][holesky]. Ensure that you configure your MetaMask wallet to connect to the Holesky network as instructed in the guide. Alternatively, you can use the Ethereum mainnet network, but remember to adjust the network settings in the code accordingly.

With these prerequisites, you're well-equipped to begin building your staking dApp with the OPUS Pool SDK. Let's embark on this journey of blockchain development!

## Next Steps

Now that you have a good understanding of the foundation, you are ready to install the OPUS Pool SDK. Please follow the instructions in the [Installation and Setup][installation] section to set up the SDK and prepare your development environment.

[opus-pool-example]: https://github.com/ChorusOne/opus-pool-demo
[wagmi]: https://wagmi.sh
[holesky]: https://github.com/eth-clients/holesky
[installation]: ./1-installation.md
