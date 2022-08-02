import { networks } from '@trezor/utxo-lib';

import { WabiSabiClient } from './backend/client';
import { WabiSabiController } from './backend/controller.browser'; // TODO
import { getAccountInfo } from './backend/getAccountInfo';
import { getAddressInfo } from './backend/getAddressInfo';
import type { GetAccountInfoParams, DiscoveryContext } from './backend/types';

export type CoinjoinBackendSettings = {
    coin: string;
    wabisabiUrl: string;
    blockbookUrl: string;
    storagePath?: string;
};

const selectNetwork = (shortcut?: string) => {
    switch (shortcut) {
        case 'REGTEST':
        case undefined:
            return networks.regtest;
        default:
            console.warn(`${shortcut} unsupported yet, REGTEST used.`);
            return networks.regtest;
    }
};

export class CoinjoinBackend {
    readonly settings;

    private readonly client;
    private readonly network;

    private abortController: AbortController | undefined;

    constructor(settings: CoinjoinBackendSettings) {
        this.settings = Object.freeze(settings);
        this.client = new WabiSabiClient(settings);
        this.network = selectNetwork(settings.coin);
    }

    getAccountInfo(params: GetAccountInfoParams, onProgress?: DiscoveryContext['onProgress']) {
        this.abortController = new AbortController();
        const controller = new WabiSabiController(this.client, this.settings);
        return getAccountInfo(params, {
            client: this.client,
            network: this.network,
            abortSignal: this.abortController.signal,
            controller,
            onProgress,
        });
    }

    getAddressInfo(params: GetAccountInfoParams, onProgress?: DiscoveryContext['onProgress']) {
        this.abortController = new AbortController();
        const controller = new WabiSabiController(this.client, this.settings);
        return getAddressInfo(params, {
            client: this.client,
            network: this.network,
            abortSignal: this.abortController.signal,
            controller,
            onProgress,
        });
    }

    cancel() {
        this.abortController?.abort();
    }
}
