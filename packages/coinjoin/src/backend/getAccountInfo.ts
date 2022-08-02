import { deriveAddresses } from '@trezor/utxo-lib';
import { countUnusedFromEnd } from '@trezor/utxo-lib/lib/discovery';
import {
    sortTxsFromLatest,
    sumAddressValues,
} from '@trezor/blockchain-link/lib/workers/electrum/methods/getAccountInfo';
import { transformTransaction } from '@trezor/blockchain-link/lib/workers/blockbook/utils';

import { getAddressScript, getFilter } from './filters';
import { getTransactions, calculateBalance, getPagination } from './utils';
import type {
    AccountInfo,
    Address,
    GetAccountInfoParams,
    ScriptResult,
    AccountAddressResult,
    WithTxs,
    MethodContext,
    DiscoveryContext,
} from './types';

const DISCOVERY_LOOKOUT = 20;

const analyzeAddress =
    (isMatch: (script: Buffer) => boolean, blockHeight: number) =>
    <T extends ScriptResult>(address: T): T => ({
        ...address,
        heights: isMatch(address.script) ? [...address.heights, blockHeight] : address.heights,
    });

const analyzeAddresses = (
    addresses: AccountAddressResult[],
    analyze: (address: AccountAddressResult) => AccountAddressResult,
    deriveMore: (from: number, count: number) => AccountAddressResult[],
    lookout = DISCOVERY_LOOKOUT,
): AccountAddressResult[] => {
    let result = addresses.map(analyze);
    let unused = countUnusedFromEnd(result, a => !a.heights.length, lookout);
    while (unused < lookout) {
        const missingCount = lookout - unused;
        const missing: AccountAddressResult[] = deriveMore(result.length, missingCount).map(
            analyze,
        );
        result = result.concat(missing);
        unused = countUnusedFromEnd(result, a => !a.heights.length, lookout);
    }
    return result;
};

const transformAddressInfo = ({ address, path, txs }: WithTxs<AccountAddressResult>): Address => {
    const sent = sumAddressValues(txs, address, tx => tx.vin);
    const received = sumAddressValues(txs, address, tx => tx.vout);
    return {
        address,
        path,
        transfers: txs.length,
        balance: (received - sent).toString(),
        sent: sent.toString(),
        received: received.toString(),
    };
};

export const getAccountInfo = async (
    { descriptor: xpub }: GetAccountInfoParams,
    { client, network, controller, onProgress }: MethodContext & DiscoveryContext,
): Promise<AccountInfo> => {
    onProgress?.({ progressMessage: 'Syncing filters' });
    await controller.init();
    onProgress?.({ progressMessage: 'Filtering' });

    const deriveMore = (type: 'receive' | 'change') => (from: number, count: number) =>
        deriveAddresses(xpub, type, from, count, network).map(({ address, path }) => ({
            address,
            path,
            script: getAddressScript(address, network),
            heights: [],
        }));

    let receive: AccountAddressResult[] = [];
    let change: AccountAddressResult[] = [];
    const everyFilter = controller.getFilterIterator();

    // eslint-disable-next-line no-restricted-syntax
    for await (const { filter, blockHash, blockHeight } of everyFilter) {
        onProgress?.({ progressMessage: 'Filtering', blockHash, progress: blockHeight });
        const isMatch = getFilter(filter, blockHash);
        const analyze = analyzeAddress(isMatch, blockHeight);

        receive = analyzeAddresses(receive, analyze, deriveMore('receive'));
        change = analyzeAddresses(change, analyze, deriveMore('change'));
    }

    onProgress?.({ progressMessage: 'Fetching' });

    const receiveTxs = await getTransactions(client, receive);
    const changeTxs = await getTransactions(client, change);
    const addresses = {
        change: changeTxs.map(transformAddressInfo),
        unused: receiveTxs.filter(({ txs }) => !txs.length).map(transformAddressInfo),
        used: receiveTxs.filter(({ txs }) => txs.length).map(transformAddressInfo),
    };
    const transactions = receiveTxs
        .flatMap(({ txs }) => txs)
        .concat(changeTxs.flatMap(({ txs }) => txs))
        .filter((item, index, self) => self.findIndex(it => it.txid === item.txid) === index)
        .map(tx => transformTransaction(xpub, addresses, tx))
        .sort(sortTxsFromLatest);
    const [balanceConfirmed, balanceUnconfirmed] = calculateBalance(transactions);
    const txCount = transactions.length;
    const txCountConfirmed = transactions.filter(
        ({ blockHeight }) => (blockHeight ?? 0) > 0,
    ).length;

    onProgress?.({ progressMessage: 'Done' });

    return {
        descriptor: xpub,
        balance: balanceConfirmed.toString(),
        availableBalance: (balanceConfirmed + balanceUnconfirmed).toString(),
        empty: !txCount,
        history: {
            total: txCountConfirmed,
            unconfirmed: txCount - txCountConfirmed,
            transactions,
        },
        addresses,
        page: getPagination(transactions.length),
    };
};
