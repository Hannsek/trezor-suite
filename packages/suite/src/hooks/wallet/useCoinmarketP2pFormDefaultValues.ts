import { useMemo } from 'react';
import regional from '@wallet-constants/coinmarket/regional';
import { buildOption } from '@wallet-utils/coinmarket/coinmarketUtils';
import { P2pInfo } from '@wallet-actions/coinmarketP2pActions';
import { Account } from '@wallet-reducers/accountsReducer';

export const useCoinmarketP2pFormDefaultValues = (
    accountSymbol: Account['symbol'],
    p2pInfo?: P2pInfo,
) => {
    const country = p2pInfo?.country || regional.unknownCountry;
    const suggestedFiatCurrency = p2pInfo?.suggestedFiatCurrency || 'USD';

    const defaultCountry = useMemo(
        () => ({
            label: regional.countriesMap.get(country),
            value: country,
        }),
        [country],
    );
    const defaultCurrency = useMemo(
        () => buildOption(suggestedFiatCurrency),
        [suggestedFiatCurrency],
    );
    const defaultCrypto = useMemo(
        () => ({
            value: accountSymbol,
            label: accountSymbol.toUpperCase(),
        }),
        [accountSymbol],
    );
    const defaultValues = useMemo(
        () =>
            p2pInfo
                ? {
                      fiatInput: '',
                      currencySelect: defaultCurrency,
                      cryptoSelect: defaultCrypto,
                      countrySelect: defaultCountry,
                  }
                : undefined,
        [p2pInfo, defaultCountry, defaultCurrency, defaultCrypto],
    );

    return { defaultValues, defaultCountry, defaultCurrency };
};
