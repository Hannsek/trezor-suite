import React from 'react';
import styled from 'styled-components';
import { useCoinmarketP2pFormContext } from '@wallet-hooks/useCoinmarketP2pForm';
import { Wrapper } from '@wallet-views/coinmarket';
import { CoinmarketSkeleton } from '@wallet-views/coinmarket/skeleton';

import Inputs from './Inputs';
import Footer from './Footer';

const Form = styled.form`
    width: 100%;
`;

const P2pForm = () => {
    const { onSubmit, handleSubmit, isLoading } = useCoinmarketP2pFormContext();
    return (
        <Wrapper responsiveSize="LG">
            {isLoading && <CoinmarketSkeleton />}
            {!isLoading && (
                <Form onSubmit={handleSubmit(onSubmit)}>
                    <Inputs />
                    <Footer />
                </Form>
            )}
        </Wrapper>
    );
};

export default P2pForm;
