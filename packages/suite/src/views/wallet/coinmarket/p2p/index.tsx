import React from 'react';
import { P2pFormContext, useCoinmarketP2pForm } from '@wallet-hooks/useCoinmarketP2pForm';
import {
    CoinmarketLayout,
    withSelectedAccountLoaded,
    WithSelectedAccountLoadedProps,
} from '@wallet-components';
import P2pForm from './components/P2pForm';

const CoinmarketP2p = (props: WithSelectedAccountLoadedProps) => {
    const coinmarketP2pContextValues = useCoinmarketP2pForm(props);
    const {
        isDraft,
        formState: { isDirty },
        handleClearFormButtonClick,
    } = coinmarketP2pContextValues;

    return (
        <CoinmarketLayout
            selectedAccount={props.selectedAccount}
            onClearFormButtonClick={isDirty || isDraft ? handleClearFormButtonClick : undefined}
        >
            <P2pFormContext.Provider value={coinmarketP2pContextValues}>
                <P2pForm />
            </P2pFormContext.Provider>
        </CoinmarketLayout>
    );
};

export default withSelectedAccountLoaded(CoinmarketP2p, {
    title: 'TR_NAV_P2P',
});
