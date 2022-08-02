import { WabiSabiController as NodeController } from '../../src/backend/controller';
import { WabiSabiController as BrowserController } from '../../src/backend/controller.browser';
import { BlockFilter, ControllerClient } from '../../src/backend/types';
import { mockFilterSequence } from '../support/filter';
import { BASE_BLOCK_HASH, BASE_BLOCK_HEIGHT } from '../../src/constants';

const CONTROLLER_PARAMS = {
    coin: 'REGTEST',
    wabisabiUrl: 'foo',
    blockbookUrl: 'bar',
};

const FILTERS: BlockFilter[] = mockFilterSequence(16, BASE_BLOCK_HEIGHT, BASE_BLOCK_HASH);

class MockClient implements ControllerClient {
    private count = 0;
    private readonly BATCH = 5;
    private readonly filters;
    constructor(filters: BlockFilter[]) {
        this.filters = filters;
    }
    fetchFilters() {
        const from = this.count++ * this.BATCH;
        return Promise.resolve(this.filters.slice(from, from + this.BATCH));
    }
}

describe('WabiSabiController', () => {
    let client: ControllerClient;

    beforeEach(() => {
        client = new MockClient(FILTERS);
    });

    it('Node controller', async () => {
        const controller = new NodeController(client, CONTROLLER_PARAMS);
        await controller.init();
        const iterator = controller.getFilterIterator();
        const received = [];
        // eslint-disable-next-line no-restricted-syntax
        for await (const b of iterator) {
            received.push(b);
        }
        expect(received).toEqual(FILTERS);
    });

    it('Browser controller', async () => {
        const controller = new BrowserController(client, CONTROLLER_PARAMS);
        await controller.init();
        const iterator = controller.getFilterIterator();
        const received = [];
        // eslint-disable-next-line no-restricted-syntax
        for await (const b of iterator) {
            received.push(b);
        }
        expect(received).toEqual(FILTERS);
    });
});
