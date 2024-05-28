# Table of contents

-   [Getting Started](getting-started.md)

## Build your Staking dApp

-   [Prerequisites](guide/0-prerequisites.md)
-   [1. Installation and Setup](guide/1-installation-and-setup.md)
-   [2. Fetching Vault Details](guide/2-fetching-vault-details.md)
-   [3. Staking](guide/3-staking.md)
-   [6. Unstaking](guide/4-unstaking.md)
-   [4. Minting osETH](guide/5-minting-os-eth.md)
-   [5. Burning osETH](guide/6-burning-os-eth.md)
-   [7. Transaction History](guide/7-transaction-history.md)
-   [8. Rewards History](guide/8-rewards-history.md)

## API Reference

-   [getDefaultVaults](docs/functions/getDefaultVaults.md)

-   OpusPool

    -   Constructor
        -   [constructor](docs/classes/OpusPool/Constructor/constructor.md)
    -   Properties
        -   [userAccount](docs/classes/OpusPool/Properties/userAccount.md)
    -   Methods
        -   [buildBurnTransaction](docs/classes/OpusPool/Methods/buildBurnTransaction.md)
        -   [buildMintTransaction](docs/classes/OpusPool/Methods/buildMintTransaction.md)
        -   [buildStakeTransaction](docs/classes/OpusPool/Methods/buildStakeTransaction.md)
        -   [buildUnstakeTransaction](docs/classes/OpusPool/Methods/buildUnstakeTransaction.md)
        -   [buildWithdrawUnstakedTransaction](docs/classes/OpusPool/Methods/buildWithdrawUnstakedTransaction.md)
        -   [getHealthFactorForUser](docs/classes/OpusPool/Methods/getHealthFactorForUser.md)
        -   [getMaxMintForVault](docs/classes/OpusPool/Methods/getMaxMintForVault.md)
        -   [getMaxUnstakeForUserForVault](docs/classes/OpusPool/Methods/getMaxUnstakeForUserForVault.md)
        -   [getOsTokenPositionForVault](docs/classes/OpusPool/Methods/getOsTokenPositionForVault.md)
        -   [getRewardsHistory](docs/classes/OpusPool/Methods/getRewardsHistory.md)
        -   [getStakeBalanceForUser](docs/classes/OpusPool/Methods/getStakeBalanceForUser.md)
        -   [getTransactionsHistory](docs/classes/OpusPool/Methods/getTransactionsHistory.md)
        -   [getUnstakeQueueForVault](docs/classes/OpusPool/Methods/getUnstakeQueueForVault.md)
        -   [getVaultDetails](docs/classes/OpusPool/Methods/getVaultDetails.md)

-   Enums

    -   [Networks](docs/enums/Networks.md)
    -   [OsTokenPositionHealth](docs/enums/OsTokenPositionHealth.md)

-   Interfaces

    -   [StakeTransactionData](docs/interfaces/StakeTransactionData.md)
    -   [UnstakeTransactionData](docs/interfaces/UnstakeTransactionData.md)
    -   [MintTransactionData](docs/interfaces/MintTransactionData.md)
    -   [VaultDetails](docs/interfaces/VaultDetails.md)
    -   [VaultTransaction](docs/interfaces/VaultTransaction.md)
    -   [RewardsDataPoint](docs/interfaces/RewardsDataPoint.md)
    -   [UnstakeQueueItem](docs/interfaces/UnstakeQueueItem.md)
