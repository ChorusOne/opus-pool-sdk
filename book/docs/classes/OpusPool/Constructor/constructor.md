### constructor

• **new OpusPool**(`params`): [`OpusPool`](../../OpusPool.md)

Creates an OpusPool instance

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `params` | `Object` | Initialization parameters |
| `params.address` | \`0x$\{string}\` | An address of the currently connected user wallet. If the user connects to a different wallet, OpusPool must be re-instantiated with a new user address |
| `params.network` | [`Networks`](../../../enums/Networks.md) | Network configuration (Networks.Ethereum or Networks.Holesky) |
| `params.rpcUrl?` | `string` | An RPC URL to interact with. If not provided, a default public node will be used. Optional |

#### Returns

[`OpusPool`](../../OpusPool.md)

An instance of OpusPool