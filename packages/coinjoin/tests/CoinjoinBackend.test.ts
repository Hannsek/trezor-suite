import { BlockbookAPI } from '@trezor/blockchain-link/lib/workers/blockbook/websocket';
import { transformAccountInfo } from '@trezor/blockchain-link/src/workers/blockbook/utils';

import { CoinjoinBackend } from '../src';

const FILTERED_ADDRESSES = [
    'bcrt1pswrqtykue8r89t9u4rprjs0gt4qzkdfuursfnvqaa3f2yql07zmq2fdmpx',
    'bcrt1q7gefpk0ehc738gc4kmltu20uq7rdxnyk7aupqg',
    'n2uwaLQYxRRutG7LQvsATxAb5Ze4GeVfXC',
];

const XPUB =
    'vpub5YX1yJFY8E236pH3iNvCpThsXLxoQoC4nwraaS5h4TZwaSp1Gg9SQoxCsrumxjh7nZRQQkNfH29TEDeMvAZVmD3rpmsDnFc5Sj4JgJG6m4b';

const SYMBOL = 'REGTEST';

describe(`CoinJoinBackend`, () => {
    let blockbook: BlockbookAPI;
    let backend: CoinjoinBackend;

    beforeAll(async () => {
        blockbook = new BlockbookAPI({
            url: 'https://coinjoin.corp.sldev.cz/blockbook/',
        });
        await blockbook.connect();
    });

    afterAll(() => {
        blockbook.dispose();
    });

    beforeEach(() => {
        backend = new CoinjoinBackend({
            coin: SYMBOL,
            blockbookUrl: 'https://coinjoin.corp.sldev.cz/blockbook/api/v2',
            wabisabiUrl: 'https://coinjoin.corp.sldev.cz/WabiSabi/api/v4/btc',
        });
    });

    it('getAddressInfo', async () => {
        const referential = await blockbook
            .getAccountInfo({
                descriptor: FILTERED_ADDRESSES[0],
                details: 'txs',
            })
            .then(transformAccountInfo);
        const info = await backend.getAddressInfo({
            descriptor: FILTERED_ADDRESSES[0],
        });
        expect(info).toMatchObject(referential);
    });

    it.only('getAccountInfo', async () => {
        const referential = await blockbook
            .getAccountInfo({
                descriptor: XPUB,
                details: 'txs',
            })
            .then(transformAccountInfo);
        const info = await backend.getAccountInfo({
            descriptor: XPUB,
        });
        expect(info).toMatchObject(referential);
    }, 15000);
});
