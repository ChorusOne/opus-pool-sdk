import { createPublicClient, PublicClient, http, Hex, parseGwei } from 'viem';
import { hardhat, holesky, mainnet } from 'viem/chains';
import { Networks } from '../types/enums';

// Represents a single request to a graphql backend
export interface GraphQLRequest {
    type: string;
    op: string;
    query: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    variables: any;
    onSuccess: (value: Response) => Response;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (reason: any) => PromiseLike<never>;
}

// Connector abstraction, providing on-chain and GraphQL API primitives
export class StakewiseConnector {
    /** Connected Ethereum network */
    network: Networks;
    /** Base URL for Stakewise main graph API */
    baseAPI: string;
    /** Base URL for Stakewise subgraph */
    baseGraph: string;
    /** Web3 connector for calling read-only contract methods */
    eth: PublicClient;
    /** Stakewise keeper contract address */
    keeper: Hex;
    /** Gas max fee */
    maxFeePerGas: bigint;
    /** Gas max priority fee */
    maxPriorityFeePerGas: bigint;

    constructor(network: string, rpcUrl?: string) {
        this.network = network as Networks;
        // These parameters might need to be changed for Gnosis and Mainnet
        this.maxFeePerGas = parseGwei('1.5');
        this.maxPriorityFeePerGas = parseGwei('1.5');
        const transport = rpcUrl ? http(rpcUrl) : http();
        switch (network) {
            case Networks.Holesky:
                this.eth = createPublicClient({
                    chain: holesky,
                    transport,
                });

                this.baseAPI = 'https://holesky-api.stakewise.io/graphql';
                this.baseGraph = 'https://holesky-graph.stakewise.io/subgraphs/name/stakewise/stakewise';
                // Stakewise keeper contract
                this.keeper = '0xB580799Bf7d62721D1a523f0FDF2f5Ed7BA4e259';
                break;
            case Networks.Ethereum:
                this.eth = createPublicClient({
                    chain: mainnet,
                    transport,
                });

                this.baseAPI = 'https://mainnet-api.stakewise.io/graphql';
                this.baseGraph = 'https://mainnet-graph.stakewise.io/subgraphs/name/stakewise/stakewise';
                this.eth = createPublicClient({
                    chain: mainnet,
                    transport: transport,
                });
                // Stakewise keeper contract
                this.keeper = '0x6B5815467da09DaA7DC83Db21c9239d98Bb487b5';
                break;
            case Networks.Hardhat:
                this.baseAPI = 'https://holesky-api.stakewise.io/graphql';
                this.baseGraph = 'https://holesky-graph.stakewise.io/subgraphs/name/stakewise/stakewise';
                this.eth = createPublicClient({
                    chain: hardhat,
                    transport: http(),
                });
                // Stakewise keeper contract
                this.keeper = '0xB580799Bf7d62721D1a523f0FDF2f5Ed7BA4e259';
                break;
            default:
                throw new Error(`Invalid Opus-Pool network passed: ${network}`);
        }
    }

    // Perform graphQL request
    graphqlRequest = (request: GraphQLRequest): Promise<Response> => {
        const body: string = JSON.stringify({
            operationName: request.op,
            query: request.query.trim(),
            variables: request.variables,
        });
        const params: RequestInit = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                Accept: '*/*',
            },
            body,
        };
        let uri: string;

        switch (request.type) {
            case 'api':
                uri = this.baseAPI;
                break;
            case 'graph':
                uri = this.baseGraph;
                break;
            default:
                throw new Error(`Invalid request type: ${request.type}`);
        }

        const endpoint = `${uri}?opName=${request.op}`;
        return fetch(endpoint, params).then(request.onSuccess).catch(request.onError);
    };
}
