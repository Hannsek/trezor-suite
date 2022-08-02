import { CoinjoinBackend } from '@trezor/coinjoin';

export class CoinjoinBackendService extends CoinjoinBackend {
    private static instances: Record<string, CoinjoinBackendService> = {};

    constructor(network: string) {
        if (network !== 'regtest')
            throw new Error('Other coins than REGTEST are currently not supported for CoinJoin');
        super({
            coin: 'REGTEST',
            blockbookUrl: 'https://coinjoin.corp.sldev.cz/blockbook/api/v2', // TODO unhardcode
            wabisabiUrl: 'https://coinjoin.corp.sldev.cz/WabiSabi/api/v4/btc', // TODO unhardcode
        });
    }

    static getInstance(network: string) {
        if (!this.instances[network]) {
            this.instances[network] = new CoinjoinBackendService(network);
        }
        return this.instances[network];
    }

    static getInstances() {
        return Object.keys(this.instances).map(key => this.instances[key]);
    }
}
