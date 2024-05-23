‌
# Opus Pool SDK

[Opus Pool SDK](https://www.npmjs.com/package/@chorus-one/opus-pool) provides
a programmatic interface to deliver integration of
non-custodial staking on Ethereum networks.

The SDK interface is implemented as Typescript library `opus-pool`,
which is distributed under Apache 2.0 license.

## To run tests

**Load the environment variables**

```bash
npx hardhat vars set INFURA_API_KEY
```

You'll be prompted to enter the value of the environment variable.

**Start the hardhat node in a separate terminal**

```bash
npx hardhat node
```

**Run the tests in a separate terminal**

```bash
npx hardhat test
```

## Integration flow
![integration flow](./book/media/integration.png)

## Demo
Visit [Demo website](https://chorusone.github.io/opus-pool-demo/) to try out
staking with Opus Pool SDK. Note that [Holesky testnet](https://github.com/eth-clients/holesky)
wallet is necessary to actually stake there.

Source code of the demo can be found [on Github](https://github.com/chorusOne/opus-pool-demo)

## HOWTO
Read [practical guide](./book/guide/0-introduction.md)
or [API docs](./book/docs/classes/OpusPool.md)
