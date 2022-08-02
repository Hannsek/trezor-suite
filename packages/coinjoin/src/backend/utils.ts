import { arrayDistinct, arrayToDictionary } from '@trezor/utils';

import { WabiSabiClient } from './client';
import type { Transaction, AddressResult, WithTxs } from './types';

const PAGE_SIZE_DEFAULT = 25;

export const getPagination = (txCount: number, perPage = PAGE_SIZE_DEFAULT) => ({
    index: 1,
    size: perPage,
    total: Math.ceil(txCount / perPage),
});

export const getTransactions = async <T extends AddressResult>(
    client: WabiSabiClient,
    addresses: T[],
): Promise<WithTxs<T>[]> => {
    const heights = addresses.flatMap(({ heights }) => heights).filter(arrayDistinct);
    const blocks = await client
        .fetchBlocks(heights)
        .then(res => arrayToDictionary(res, b => b.height));

    return addresses.map(({ heights, ...rest }) => {
        const txs = heights.flatMap(height => blocks[height].txs);
        return {
            ...rest,
            txs: txs.filter(({ vin, vout }) =>
                vin
                    .concat(vout)
                    .flatMap(({ addresses = [] }) => addresses)
                    .includes(rest.address),
            ),
        };
    });
};

export const calculateBalance = (transactions: Transaction[]) =>
    transactions.reduce<[number, number]>(
        ([confirmed, unconfirmed], { type, totalSpent, blockHeight = -1 }) => {
            if (!['recv', 'sent', 'self'].includes(type)) {
                return [confirmed, unconfirmed];
            }
            const value = Number.parseInt(totalSpent, 10);
            const delta = type === 'recv' ? value : -value;
            return blockHeight > 0
                ? [confirmed + delta, unconfirmed]
                : [confirmed, unconfirmed + delta];
        },
        [0, 0],
    );
