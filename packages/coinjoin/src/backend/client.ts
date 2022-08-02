import { EventEmitter } from 'events';

import { httpGet, httpPost, RequestOptions } from '../utils/http';
import type { BlockFilter, BlockbookTransaction, ControllerClient } from './types';

// http://localhost:8081/api/v4/btc/Batch/synchronize?bestKnownBlockHash=0f9188f13cb7b2c71f2a335e3a4fc328bf5beb436012afca590b1a11466e2206&maxNumberOfFilters=2&estimateSmartFeeMode=Conservative
// http://localhost:8081/WabiSabi/api/v4/btc/Blockchain/synchronize?bestKnownBlockHash=0f9188f13cb7b2c71f2a335e3a4fc328bf5beb436012afca590b1a11466e2206&maxNumberOfFilters=10&estimateSmartFeeMode=Conservative
// http://localhost:8081/WabiSabi/api/v4/btc/Batch/synchronize?bestKnownBlockHash=0f9188f13cb7b2c71f2a335e3a4fc328bf5beb436012afca590b1a11466e2206&maxNumberOfFilters=2&estimateSmartFeeMode=Conservative
// http://localhost:8081/WabiSabi/api/v4/btc/Blockchain/Batch/synchronize?bestKnownBlockHash=0f9188f13cb7b2c71f2a335e3a4fc328bf5beb436012afca590b1a11466e2206&maxNumberOfFilters=10&estimateSmartFeeMode=Conservative
// '/api/v4/btc/Blockchain/status'

export type BlockbookBlock = {
    height: number;
    txs: BlockbookTransaction[];
};

type WabiSabiClientOptions = {
    wabisabiUrl: string;
    blockbookUrl: string;
    timeout?: number;
};

type WabiSabiRequestOptions = Pick<RequestOptions, 'identity' | 'signal' | 'delay'>;

export class WabiSabiClient extends EventEmitter implements ControllerClient {
    protected readonly wabisabiUrl;
    protected readonly blockbookUrl;

    constructor(options: WabiSabiClientOptions) {
        super();
        this.wabisabiUrl = options.wabisabiUrl;
        this.blockbookUrl = options.blockbookUrl;
    }

    isConnected() {
        return true;
    }

    connect() {
        return false;
    }

    disconnect() {
        return false;
    }

    getBlock() {}

    private async fetchAndParseBlock(
        height: number,
        options?: WabiSabiRequestOptions,
    ): Promise<BlockbookBlock> {
        const response = await this.blockbook(options).get(`block/${height}`); // TODO rawblock

        if (response.status === 200) {
            return response.json();
        }
        if (response.status >= 400 && response.status < 500) {
            const { error } = await response.json();
            throw new Error(`${response.status}: ${error}`);
        }
        throw new Error(`${response.status}: ${response.statusText}`);
    }

    private blockCache: BlockbookBlock[] = [];

    async fetchBlock(height: number, options?: WabiSabiRequestOptions) {
        if (!this.blockCache[height]) {
            this.blockCache[height] = await this.fetchAndParseBlock(height, options);
        }
        return this.blockCache[height];
    }

    fetchBlocks(heights: number[], options?: WabiSabiRequestOptions): Promise<BlockbookBlock[]> {
        return Promise.all(heights.map(height => this.fetchBlock(height, options)));
    }

    async fetchFilters(
        bestKnownBlockHash: string,
        count: number,
        options?: WabiSabiRequestOptions,
    ) {
        const response = await this.wabisabi(options).get('Blockchain/filters', {
            bestKnownBlockHash,
            count,
        });

        if (response.status === 204) {
            // Provided hash is a tip
            return [];
        }
        if (response.status === 200) {
            const result: { bestHeight: number; filters: string[] } = await response.json();
            return result.filters.map<BlockFilter>(data => {
                const [blockHeight, blockHash, filter, prevHash, blockTime] = data.split(':');
                return {
                    blockHeight: Number(blockHeight),
                    blockHash,
                    filter,
                    prevHash,
                    blockTime: Number(blockTime),
                };
            });
        }
        if (response.status >= 400 && response.status < 500) {
            const error = await response.json();
            throw new Error(`${response.status}: ${error}`);
        }
        throw new Error(`${response.status}: ${response.statusText}`);
    }

    async fetchServerInfo(options?: WabiSabiRequestOptions) {
        const res = await this.wabisabi(options).get('Batch/synchronize', {
            bestKnownBlockHash: '0f9188f13cb7b2c71f2a335e3a4fc328bf5beb436012afca590b1a11466e2206',
            maxNumberOfFilters: 0,
            estimateSmartFeeMode: 'Conservative',
        });
        return res.json();
    }

    private wabisabi(options?: WabiSabiRequestOptions) {
        return this.request(this.wabisabiUrl, options);
    }

    private blockbook(options?: WabiSabiRequestOptions) {
        return this.request(this.blockbookUrl, options);
    }

    private request(url: string, options?: WabiSabiRequestOptions) {
        return {
            get: (path: string, query?: Record<string, any>) =>
                httpGet(`${url}/${path}`, query, options),
            post: (path: string, body?: Record<string, any>) =>
                httpPost(`${url}/${path}`, body, options),
        };
    }
}
