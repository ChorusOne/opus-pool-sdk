### constructor

• **new OpusPool**(`params`): [`OpusPool`](../../OpusPool.md)

Instantiates pooling solution facade that provides convenience methods
to allow staking for individual user.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `params` | `Object` | Parameters to configure the pooling solution interface. |
| `params.address` | \`0x$\{string}\` | An address of currently connected user wallet. If user connects different wallet, pooling solution implementation must be re-instantiated with a new user address. |
| `params.network` | [`Networks`](../../../enums/Networks.md) | One of holesky, ethereum, hardhat |
| `params.rpcUrl?` | `string` | RPC Url to interact with If not defined, either public node |

#### Returns

[`OpusPool`](../../OpusPool.md)