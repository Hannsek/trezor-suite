import type { Transaction as BlockbookTransaction } from '@trezor/blockchain-link/src/types/blockbook';
import type { Network } from '@trezor/utxo-lib';

import type { WabiSabiClient } from './client';

export type { AccountInfo, Address, Transaction } from '@trezor/blockchain-link/src/types';

export type { BlockbookTransaction };

export type BlockFilter = {
    blockHeight: number;
    blockHash: string;
    filter: string;
    prevHash: string;
    blockTime: number;
};

export type MethodContext = {
    client: WabiSabiClient;
    network: Network;
    abortSignal?: AbortSignal;
};

type DiscoveryProgress = {
    blockHash?: string; // `0${i}`,
    progress?: number; // i,
    progressMessage?: string; // i > 60 ? 'Checking transaction history' : 'Loading block filters',
};

export type DiscoveryContext = {
    controller: Controller;
    onProgress?: (progress: DiscoveryProgress) => void;
};

export type GetAccountInfoParams = {
    descriptor: string;
    lastKnownState?: {
        balance: string;
        blockHash: string;
    };
};

export interface Controller {
    init(): Promise<void>;
    getFilterIterator(
        fromHash?: string,
        batchSize?: number,
    ): Generator<BlockFilter> | AsyncGenerator<BlockFilter>;
}

export interface ControllerClient {
    fetchFilters(bestKnownBlockHash: string, count: number): Promise<BlockFilter[]>;
}

export type ScriptResult = {
    script: Buffer;
    heights: number[];
};

export type AddressResult = ScriptResult & {
    address: string;
};

export type AccountAddressResult = AddressResult & {
    path: string;
};

export type WithTxs<T extends AddressResult> = Omit<T, 'heights'> & {
    txs: BlockbookTransaction[];
};
