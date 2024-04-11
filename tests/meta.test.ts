import { OpusPool, RewardsDataPoint, VaultDetails, VaultTransaction } from '../src';
import { Networks } from '../src/types/enums';
import { getDefaultVaults } from '../src/internal/defaultVaults';

// Handle bigint parameters
const toObject = (item: any): string => {
    return JSON.stringify(
        item,
        (key, value) => (typeof value === 'bigint' ? value.toString() : value), // return everything else unchanged
    );
};

describe('vaultDetails', () => {
    it('returns correct details and stake for Chorus mainnet wallet by default', async () => {
        // contract call via public node will work longer time
        jest.setTimeout(10000);
        const params = {
            network: Networks.Ethereum,
            address: '0x8a3abdbc1cf8a63b248b1bd75d340fd5a31b8d3b' as const,
        };

        const pool = new OpusPool(params);
        const defaultVaults = getDefaultVaults(params.network);
        const details: VaultDetails[] = await pool.getVaultDetails(defaultVaults);
        const firstDetails = details[0];
        expect(firstDetails.name.startsWith('Chorus One')).toBeTruthy();
        expect(firstDetails.tvl > 0).toBeTruthy();
        expect(firstDetails.apy > 0).toBeTruthy();
        expect(firstDetails.description.length > 0).toBeTruthy();
        expect(firstDetails.logoUrl.length > 0).toBeTruthy();
    });

    it('returns correct details and stake for Chorus holesky wallets by default', async () => {
        // contract call via public node will work longer time
        jest.setTimeout(10000);
        const params = {
            network: Networks.Holesky,
            address: '0xd68af28aee9536144d4b9b6c0904caf7e794b3d3' as const,
        };

        const pool = new OpusPool(params);
        const defaultVaults = getDefaultVaults(params.network);
        const details: VaultDetails[] = await pool.getVaultDetails(defaultVaults);
        expect(details.length === 2);

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        details.forEach((detail: any) => {
            expect(detail.name.startsWith('Chorus One')).toBeTruthy();
            expect(detail.tvl >= 0).toBeTruthy();
            expect(detail.apy >= 0).toBeTruthy();
            expect(detail.description.length > 0).toBeTruthy();
            expect(detail.logoUrl.length > 0).toBeTruthy();
        });
    });
});

describe('rewardsHistory', () => {
    it('returns correct rewards history for given period of time for Chorus mainnet stakers', async () => {
        const params = {
            network: Networks.Ethereum,
            address: '0x8a3abdbc1cf8a63b248b1bd75d340fd5a31b8d3b' as const,
        };

        const pool = new OpusPool(params);
        const defaultVaults = getDefaultVaults(params.network);
        const rewards: RewardsDataPoint[] = await pool.getRewardsHistory({
            from: new Date('2023-11-25'),
            to: new Date('2023-12-08'),
            vault: defaultVaults[0],
        });

        expect(toObject(rewards)).toBe(
            '[{"when":"2023-11-25T00:00:00.000Z","amount":"0","vault":"0xe6d8d8ac54461b1c5ed15740eee322043f696c08"},{"when":"2023-11-26T00:00:00.000Z","amount":"0","vault":"0xe6d8d8ac54461b1c5ed15740eee322043f696c08"},{"when":"2023-11-27T00:00:00.000Z","amount":"0","vault":"0xe6d8d8ac54461b1c5ed15740eee322043f696c08"},{"when":"2023-11-28T00:00:00.000Z","amount":"131930711039","vault":"0xe6d8d8ac54461b1c5ed15740eee322043f696c08"},{"when":"2023-11-29T00:00:00.000Z","amount":"2450686234612","vault":"0xe6d8d8ac54461b1c5ed15740eee322043f696c08"},{"when":"2023-11-30T00:00:00.000Z","amount":"5097408735145","vault":"0xe6d8d8ac54461b1c5ed15740eee322043f696c08"},{"when":"2023-12-01T00:00:00.000Z","amount":"8527616923862","vault":"0xe6d8d8ac54461b1c5ed15740eee322043f696c08"},{"when":"2023-12-02T00:00:00.000Z","amount":"11835261931198","vault":"0xe6d8d8ac54461b1c5ed15740eee322043f696c08"},{"when":"2023-12-03T00:00:00.000Z","amount":"15206105950720","vault":"0xe6d8d8ac54461b1c5ed15740eee322043f696c08"},{"when":"2023-12-04T00:00:00.000Z","amount":"18540389751537","vault":"0xe6d8d8ac54461b1c5ed15740eee322043f696c08"},{"when":"2023-12-05T00:00:00.000Z","amount":"21847739821538","vault":"0xe6d8d8ac54461b1c5ed15740eee322043f696c08"},{"when":"2023-12-06T00:00:00.000Z","amount":"23558038849650","vault":"0xe6d8d8ac54461b1c5ed15740eee322043f696c08"},{"when":"2023-12-07T00:00:00.000Z","amount":"25180161000803","vault":"0xe6d8d8ac54461b1c5ed15740eee322043f696c08"},{"when":"2023-12-08T00:00:00.000Z","amount":"29168628745466","vault":"0xe6d8d8ac54461b1c5ed15740eee322043f696c08"}]',
        );
    });
});

describe('interactionHistory', () => {
    it('returns correct interaction history for given period of time for Chorus mainnet stakers', async () => {
        const params = {
            network: Networks.Ethereum,
            address: '0x8a3abdbc1cf8a63b248b1bd75d340fd5a31b8d3b' as const,
        };

        const pool = new OpusPool(params);
        const defaultVaults = getDefaultVaults(params.network);
        const interactions: VaultTransaction[] = await pool.getTransactionsHistory(defaultVaults);

        const expectedInteraction = {
            vault: '0xe6d8d8ac54461b1c5ed15740eee322043f696c08',
            when: '2023-11-28T11:38:11.000Z',
            type: 'Deposited',
            amount: '50000000000000000',
            hash: '0xf265f7aa11bb45643eafecfddb013ffd68ef42bda618f3e07d2668da8261d084-171',
        };

        const interactionExists = interactions.find(
            (interaction) =>
                interaction.vault === expectedInteraction.vault &&
                interaction.when.getDate() === 28 &&
                interaction.when.getMonth() === 10 && // month is 0-based
                interaction.when.getFullYear() === 2023 &&
                interaction.type === expectedInteraction.type &&
                interaction.amount.toString() === expectedInteraction.amount &&
                interaction.hash === expectedInteraction.hash,
        );

        expect(interactionExists).toBeTruthy();
    });
});
