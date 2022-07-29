import { P2pProvider } from 'invity-api';
import { COINMARKET_P2P } from '@wallet-actions/constants';
import invityAPI from '@suite-services/invityAPI';

export interface P2pInfo {
    country?: string;
    suggestedFiatCurrency?: string; // optional field, fiat currency based on user's IP
    providers: P2pProvider[];
    supportedCoins: Set<string>;
    supportedCurrencies: Set<string>;
    supportedCountries: Set<string>;
}

export type CoinmarketP2pAction = { type: typeof COINMARKET_P2P.SAVE_P2P_INFO; p2pInfo: P2pInfo };

export const loadP2pInfo = async (): Promise<P2pInfo> => {
    const p2pInfo = await invityAPI.getP2pList();

    const country = p2pInfo?.country;
    const suggestedFiatCurrency = p2pInfo?.suggestedFiatCurrency;
    const providers = p2pInfo?.providers || [];
    const supportedCoins: string[] = [];
    const supportedCurrencies: string[] = [];
    const supportedCountries: string[] = [];
    providers.forEach(provider => {
        if (provider.isActive) {
            supportedCoins.push(...provider.tradedCoins.map(c => c.toLowerCase()));
            supportedCurrencies.push(...provider.tradedCurrencies.map(c => c.toLowerCase()));
            supportedCountries.push(...provider.supportedCountries);
        }
    });

    return {
        country,
        suggestedFiatCurrency,
        providers,
        supportedCoins: new Set(supportedCoins),
        supportedCurrencies: new Set(supportedCurrencies),
        supportedCountries: new Set(supportedCountries),
    };
};

export const saveP2pInfo = (p2pInfo: P2pInfo): CoinmarketP2pAction => ({
    type: COINMARKET_P2P.SAVE_P2P_INFO,
    p2pInfo,
});
