import { createPublicClient, PublicClient, http, Hex, parseGwei } from 'viem';
import { hardhat, holesky, mainnet } from 'viem/chains';
import { Networks } from '../types/enums';

// Represents a single request to a graphql backend
export interface GraphQLRequest {
    type: 'api' | 'graph';
    op: string;
    query: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    variables: any;
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
    /** Stakewise price oracle contract address */
    priceOracle: Hex;
    /** Stakewise mint token config contract address */
    mintTokenConfig: Hex;
    /** Stakewise mint token controller contract address */
    mintTokenController: Hex;
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
                this.priceOracle = '0xe31FAf135A6047Cbe595F91B4b6802cDB9B46E2b';
                this.mintTokenConfig = '0x4483965Ed85cd5e67f2a7a0EB462aCcC37b23D72';
                this.mintTokenController = '0x7BbC1733ee018f103A9a9052a18fA9273255Cf36';
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
                this.priceOracle = '0x8023518b2192FB5384DAdc596765B3dD1cdFe471';
                this.mintTokenConfig = '0xE8822246F8864DA92015813A39ae776087Fb1Cd5';
                this.mintTokenController = '0x2A261e60FB14586B474C208b1B7AC6D0f5000306';
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
                this.priceOracle = '0xe31FAf135A6047Cbe595F91B4b6802cDB9B46E2b';
                this.mintTokenConfig = '0x4483965Ed85cd5e67f2a7a0EB462aCcC37b23D72';
                this.mintTokenController = '0x7BbC1733ee018f103A9a9052a18fA9273255Cf36';
                break;
            default:
                throw new Error(`Invalid Opus-Pool network passed: ${network}`);
        }
    }

    // Perform graphQL request
    graphqlRequest = async (request: GraphQLRequest): Promise<{ data: any }> => {
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
        const response = await fetch(endpoint, params);
        if (!response.ok) {
            throw new Error(`Invalid response from Stakewise. Endpoint: ${endpoint}`);
        }
        const responseData = await response.json();

        if (responseData.errors && responseData.errors.length) {
            throw new Error(responseData.errors[0].message);
        }
        if (!responseData.data) {
            throw new Error('Response from Stakewise is missing data');
        }
        return responseData;
    };
}
