import { Networks, OpusPool } from '../src';
import { getHarvestParams } from '../src/api/getHarvestParams';

const VAULT_ADDRESS = '0xd68AF28AeE9536144d4B9B6C0904CAf7E794B3D3';
const USER_ADDRESS = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266';

const originalFetch = global.fetch;
let osTokenPositionsCount = 0;
let vaultCount = 0;
let userRewardsCount = 0;
let allocatorActionsCount = 0;
let harvestParamsCount = 0;

const mockFetch = jest.fn().mockImplementation((input, init) => {
    // OsTokenPositions:
    // on first call, return ok: false
    // 2nd call, return ok: true, errors field in response with message
    // 3rd call: return ok: true, no data field in response
    // 4th call: return ok: true, empty osTokenPositions array
    if (input === 'https://holesky-graph.stakewise.io/subgraphs/name/stakewise/stakewise?opName=OsTokenPositions') {
        osTokenPositionsCount += 1;
        switch (osTokenPositionsCount) {
            case 1:
                return Promise.resolve({
                    ok: false,
                });
            case 2:
                return Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve({ errors: [{ message: 'Test error message' }] }),
                });
            case 3:
                return Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve({}),
                });
            case 4:
                return Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve({ data: { osTokenPositions: [] } }),
                });
            default:
                return Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve({ data: { osTokenPositions: [{ shares: '0' }] } }),
                });
        }
        // Vault:
        // 1: return ok: false
        // 2: missing vault field in response
    } else if (input === 'https://holesky-graph.stakewise.io/subgraphs/name/stakewise/stakewise?opName=Vault') {
        vaultCount += 1;
        switch (vaultCount) {
            case 1:
                return Promise.resolve({
                    ok: false,
                });
            default:
                return Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve({ data: {} }),
                });
        }
    } else if (input === 'https://holesky-api.stakewise.io/graphql?opName=UserRewards') {
        userRewardsCount += 1; // Increment call count for the specific URL
        switch (userRewardsCount) {
            case 1:
                return Promise.resolve({
                    ok: false,
                });
            default:
                return Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve({ data: {} }),
                });
        }
        // AllocatorActions
    } else if (
        input === 'https://holesky-graph.stakewise.io/subgraphs/name/stakewise/stakewise?opName=AllocatorActions'
    ) {
        allocatorActionsCount += 1;
        switch (allocatorActionsCount) {
            case 1:
                return Promise.resolve({
                    ok: false,
                });
            case 2:
                return Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve({ data: { allocatorActions: [] } }),
                });
            default:
                return Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve({ data: {} }),
                });
        }
    } else if (input === 'https://holesky-api.stakewise.io/graphql?opName=HarvestParams') {
        harvestParamsCount += 1;
        switch (harvestParamsCount) {
            case 1:
                return Promise.resolve({
                    ok: false,
                });
            default:
                return Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve({ data: {} }),
                });
        }
    } else {
        return originalFetch(input, init); // Fallback to the original fetch for other URLs
    }
});

global.fetch = mockFetch;

describe('OsTokenPositions', () => {
    it('returns the correct error', async () => {
        const pool = new OpusPool({
            address: USER_ADDRESS,
            network: Networks.Hardhat,
        });
        // 1st call
        await pool
            .getOsTokenPositionForVault(VAULT_ADDRESS)
            .then((res) => res)
            .catch((err) => {
                expect(err).toBeInstanceOf(Error);
                expect(err.message).toBe(
                    'Invalid response from Stakewise. Endpoint: https://holesky-graph.stakewise.io/subgraphs/name/stakewise/stakewise?opName=OsTokenPositions',
                );
            });
        // 2nd call
        await pool
            .getOsTokenPositionForVault(VAULT_ADDRESS)
            .then((res) => res)
            .catch((err) => {
                expect(err).toBeInstanceOf(Error);
                expect(err.message).toBe('Test error message');
            });
        // 3rd call
        await pool
            .getOsTokenPositionForVault(VAULT_ADDRESS)
            .then((res) => res)
            .catch((err) => {
                expect(err).toBeInstanceOf(Error);
                expect(err.message).toBe('Response from Stakewise is missing data');
            });
        // 4th call
        await pool
            .getOsTokenPositionForVault(VAULT_ADDRESS)
            .then((res) => res)
            .catch((err) => {
                expect(err).toBeInstanceOf(Error);
                expect(err.message).toBe(
                    'Minted shares data is missing the osTokenPositions field or the field is empty',
                );
            });
    });
});

describe('Vault', () => {
    it('returns the correct error', async () => {
        const pool = new OpusPool({
            address: USER_ADDRESS,
            network: Networks.Hardhat,
        });
        await pool
            .getVaultDetails([VAULT_ADDRESS])
            .then((res) => res)
            .catch((err) => {
                expect(err).toBeInstanceOf(Error);
                expect(err.message).toBe(
                    'Invalid response from Stakewise. Endpoint: https://holesky-graph.stakewise.io/subgraphs/name/stakewise/stakewise?opName=Vault',
                );
            });
        await pool
            .getVaultDetails([VAULT_ADDRESS])
            .then((res) => res)
            .catch((err) => {
                expect(err).toBeInstanceOf(Error);
                expect(err.message).toBe('Vault data is missing the vault field');
            });
    });
});

describe('AllocatorActions', () => {
    it('returns the correct error', async () => {
        const pool = new OpusPool({
            address: USER_ADDRESS,
            network: Networks.Hardhat,
        });
        await pool
            .getTransactionsHistory([VAULT_ADDRESS])
            .then((res) => res)
            .catch((err) => {
                expect(err).toBeInstanceOf(Error);
                expect(err.message).toBe(
                    'Invalid response from Stakewise. Endpoint: https://holesky-graph.stakewise.io/subgraphs/name/stakewise/stakewise?opName=AllocatorActions',
                );
            });
        await pool
            .getTransactionsHistory([VAULT_ADDRESS])
            .then((res) => res)
            .catch((err) => {
                expect(err).toBeInstanceOf(Error);
                expect(err.message).toBe(
                    'Transaction data is missing the allocatorActions field or the field is empty',
                );
            });
    });
});

describe('UserRewards', () => {
    it('returns the correct error', async () => {
        const pool = new OpusPool({
            address: USER_ADDRESS,
            network: Networks.Hardhat,
        });
        await pool
            .getRewardsHistory({
                from: new Date('2023-11-25'),
                to: new Date('2023-12-08'),
                vault: VAULT_ADDRESS,
            })
            .then((res) => res)
            .catch((err) => {
                expect(err).toBeInstanceOf(Error);
                expect(err.message).toBe(
                    'Invalid response from Stakewise. Endpoint: https://holesky-api.stakewise.io/graphql?opName=UserRewards',
                );
            });
        await pool
            .getRewardsHistory({
                from: new Date('2023-11-25'),
                to: new Date('2023-12-08'),
                vault: VAULT_ADDRESS,
            })
            .then((res) => res)
            .catch((err) => {
                expect(err).toBeInstanceOf(Error);
                expect(err.message).toBe('Rewards data is missing the userRewards field or the field is empty');
            });
    });
});

describe('HarvestParams', () => {
    it('returns the correct error', async () => {
        const pool = new OpusPool({
            address: USER_ADDRESS,
            network: Networks.Hardhat,
        });
        await getHarvestParams(pool.connector, VAULT_ADDRESS)
            .then((res) => res)
            .catch((err) => {
                expect(err).toBeInstanceOf(Error);
                expect(err.message).toBe(
                    'Invalid response from Stakewise. Endpoint: https://holesky-api.stakewise.io/graphql?opName=HarvestParams',
                );
            });
        await getHarvestParams(pool.connector, VAULT_ADDRESS)
            .then((res) => res)
            .catch((err) => {
                expect(err).toBeInstanceOf(Error);
                expect(err.message).toBe(
                    'Harvest params data is missing the harvestParams field or the field is empty',
                );
            });
    });
});
