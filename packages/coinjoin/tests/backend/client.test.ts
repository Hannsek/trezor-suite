import { WabiSabiClient } from '../../src/backend/client';

const ZERO_HASH = '0f9188f13cb7b2c71f2a335e3a4fc328bf5beb436012afca590b1a11466e2206';
const TIP_HASH = '1e8fce8aa8abecc45614296bf81f2b7cb072ff5e6bb1b2ee77e841e927edbec4'; // '6dffb5193c138e5e89f8ad8f5d747b086a7511e777199cb8a3f58d6ccadb79f3';
const NONEXISTENT_HASH = 'deadbeef3cb7b2c71f2a335e3a4fc328bf5beb436012afca590b1a11466e2206';
const MALFORMED_HASH = 'deadbeef';

describe('WabiSabiClient', () => {
    let client: WabiSabiClient;

    beforeAll(() => {
        client = new WabiSabiClient({
            blockbookUrl: 'https://coinjoin.corp.sldev.cz/blockbook/api/v2',
            wabisabiUrl: 'https://coinjoin.corp.sldev.cz/WabiSabi/api/v4/btc',
        });
    });

    it('fetchFilters success', async () => {
        const filters = await client.fetchFilters(ZERO_HASH, 10);
        expect(filters.length).toBe(10);
    });

    it('fetchFilters tip', async () => {
        const filters = await client.fetchFilters(TIP_HASH, 10);
        expect(filters.length).toBe(0);
    });

    it('fetchFilters bad params', async () => {
        await expect(client.fetchFilters(TIP_HASH, -1)).rejects.toThrow(/^400:/);
    });

    it('fetchFilters not found', async () => {
        await expect(client.fetchFilters(NONEXISTENT_HASH, 10)).rejects.toThrow(
            new RegExp(`404:.*${NONEXISTENT_HASH}`),
        );
    });

    it('fetchFilters malformed', async () => {
        await expect(client.fetchFilters(MALFORMED_HASH, 10)).rejects.toThrow(/^500:/);
    });

    it('fetchBlock success', async () => {
        const block = await client.fetchBlock(3);
        expect(block).toMatchObject({ height: 3 });
    });

    it('fetchBlock not found', async () => {
        await expect(client.fetchBlock(999)).rejects.toThrow(/^400:/);
    });

    it('fetchBlocks success', async () => {
        const blocks = await client.fetchBlocks([1, 7, 4]);
        expect(blocks).toMatchObject([{ height: 1 }, { height: 7 }, { height: 4 }]);
    });

    it('fetchBlocks not found', async () => {
        await expect(client.fetchBlocks([1, 999, 222])).rejects.toThrow(/^400:/);
    });
});
