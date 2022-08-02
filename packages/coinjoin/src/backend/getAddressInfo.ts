import { transformTransaction } from '@trezor/blockchain-link/lib/workers/blockbook/utils';

import { getAddressScript, getFilter } from './filters';
import { getTransactions, calculateBalance, getPagination } from './utils';
import type { AccountInfo, MethodContext, DiscoveryContext, GetAccountInfoParams } from './types';

export const getAddressInfo = async (
    { descriptor: address }: GetAccountInfoParams,
    { client, network, controller }: MethodContext & DiscoveryContext,
): Promise<AccountInfo> => {
    await controller.init();

    // const everyBlockFilter = storage.getBlockFilterIterator();
    const script = getAddressScript(address, network);
    const heights: number[] = [];
    const everyFilter = controller.getFilterIterator();

    // eslint-disable-next-line no-restricted-syntax
    for await (const { filter, blockHash, blockHeight } of everyFilter) {
        const isMatch = getFilter(filter, blockHash);
        if (isMatch(script)) heights.push(blockHeight);
    }

    const [{ txs }] = await getTransactions(client, [{ address, script, heights }]);
    const txCount = txs.length;
    const txCountConfirmed = txs.filter(({ blockHeight }) => blockHeight > 0).length;
    const transactions = txs.map(tx => transformTransaction(address, undefined, tx));
    const [balanceConfirmed, balanceUnconfirmed] = calculateBalance(transactions);

    return {
        descriptor: address,
        balance: balanceConfirmed.toString(),
        availableBalance: (balanceConfirmed + balanceUnconfirmed).toString(),
        empty: !txCount,
        history: {
            total: txCountConfirmed,
            unconfirmed: txCount - txCountConfirmed,
            transactions,
        },
        page: getPagination(txs.length),
    };
};
