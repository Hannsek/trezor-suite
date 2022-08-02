import { BASE_BLOCK_HASH, FILTERS_BATCH_SIZE } from '../constants';
import type { Controller, ControllerClient } from './types';
import type { CoinjoinBackendSettings } from '../CoinjoinBackend';

export class WabiSabiController implements Controller {
    private readonly client;

    constructor(client: ControllerClient, _params: CoinjoinBackendSettings) {
        this.client = client;
    }

    init() {
        return Promise.resolve();
    }

    async *getFilterIterator(fromHash = BASE_BLOCK_HASH, batchSize = FILTERS_BATCH_SIZE) {
        let knownBlockHash = fromHash;
        while (knownBlockHash) {
            // eslint-disable-next-line no-await-in-loop
            const batch = await this.client.fetchFilters(knownBlockHash, batchSize);
            for (let i = 0; i < batch.length; ++i) {
                yield batch[i];
            }
            knownBlockHash = batch[batch.length - 1]?.blockHash;
        }
    }
}
