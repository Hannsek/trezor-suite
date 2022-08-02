import { networks } from '@trezor/utxo-lib';

import { getAddressScript, getFilter } from '../../src/backend/filters';

const NETWORK = networks.regtest;

const RECEIVE_ADDRESS_0 = 'bcrt1pksw3pwfgueqmnxvyesjxj24q2wek77lsq4jan745j2z9wr9csf3qpgmdpz'; // OUT 106, IN 108
const CHANGE_ADDRESS_0 = 'bcrt1pc3488glntqgqel3jjtwujl8g50xrvx04ewpt799ns77dg756km5qa66ca8'; // OUT 108, IN 109

const BLOCK_106 = {
    height: 106,
    filter: '0135dff8',
    hash: '2c94e940c0584944bfdf0137936e6a6fc8ad4416a96b3663b09961574568331c',
};

const BLOCK_108 = {
    height: 108,
    filter: '0662a3ec50c3e5524c8b25ceaa9c061aef80',
    hash: '4bf55f6337c2e921fe2bf87bb121ded31988ea99d9edf2dc5498f605fd1d966e',
};

const BLOCK_109 = {
    height: 109,
    filter: '0704ac18e1c3e5f4f22fd21e20233627d8927624',
    hash: '35fbbceea020bc388dcb1b7afcba60e27da0889bd3d0689d2a786e9a8bd12746',
};

describe('Golomb filtering', () => {
    it('Receive address as input', () => {
        const script = getAddressScript(RECEIVE_ADDRESS_0, NETWORK);
        const filter = getFilter(BLOCK_108.filter, BLOCK_108.hash);
        expect(filter(script)).toBe(true);
    });

    it('Receive address as output', () => {
        const script = getAddressScript(RECEIVE_ADDRESS_0, NETWORK);
        const filter = getFilter(BLOCK_106.filter, BLOCK_106.hash);
        expect(filter(script)).toBe(true);
    });

    it('Receive address nowhere', () => {
        const script = getAddressScript(RECEIVE_ADDRESS_0, NETWORK);
        const filter = getFilter(BLOCK_109.filter, BLOCK_109.hash);
        expect(filter(script)).toBe(false);
    });

    it('Change address as input', () => {
        const script = getAddressScript(CHANGE_ADDRESS_0, NETWORK);
        const filter = getFilter(BLOCK_109.filter, BLOCK_109.hash);
        expect(filter(script)).toBe(true);
    });

    it('Change address as output', () => {
        const script = getAddressScript(CHANGE_ADDRESS_0, NETWORK);
        const filter = getFilter(BLOCK_108.filter, BLOCK_108.hash);
        expect(filter(script)).toBe(true);
    });

    it('Change address nowhere', () => {
        const script = getAddressScript(CHANGE_ADDRESS_0, NETWORK);
        const filter = getFilter(BLOCK_106.filter, BLOCK_106.hash);
        expect(filter(script)).toBe(false);
    });
});
