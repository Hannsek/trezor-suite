import React from 'react';
import Bignumber from 'bignumber.js';
import { Controller } from 'react-hook-form';
import { FIAT } from '@suite-config';
import { Translation } from '@suite-components';
import { CoinLogo, Input, Select } from '@trezor/components';
import { buildOption } from '@wallet-utils/coinmarket/coinmarketUtils';
import { useCoinmarketP2pFormContext } from '@wallet-hooks/useCoinmarketP2pForm';
import { isDecimalsValid } from '@wallet-utils/validation';
import { InputError } from '@wallet-components';
import { MAX_LENGTH } from '@suite-constants/inputs';
import { getInputState } from '@wallet-utils/sendFormUtils';
import { Left, Middle, Right, StyledIcon, Wrapper } from '@wallet-views/coinmarket';
import styled from 'styled-components';

const Option = styled.div`
    display: flex;
    align-items: center;
`;

const Label = styled.div`
    padding-left: 10px;
`;

const Inputs = () => {
    const { register, account, errors, control, formState, defaultCurrency, p2pInfo, getValues } =
        useCoinmarketP2pFormContext();
    const fiatInput = 'fiatInput';
    const currencySelect = 'currencySelect';
    const cryptoSelect = 'cryptoSelect';
    const fiatInputValue = getValues('fiatInput');

    return (
        <Wrapper responsiveSize="LG">
            <Left>
                <Input
                    noTopLabel
                    innerRef={register({
                        validate: (value: string) => {
                            if (!value) {
                                if (formState.isSubmitting) {
                                    return <Translation id="TR_P2P_VALIDATION_ERROR_EMPTY" />;
                                }
                                return;
                            }

                            const amountBig = new Bignumber(value);
                            if (amountBig.isNaN()) {
                                return <Translation id="AMOUNT_IS_NOT_NUMBER" />;
                            }

                            if (amountBig.lte(0)) {
                                return <Translation id="AMOUNT_IS_TOO_LOW" />;
                            }

                            if (!isDecimalsValid(value, 2)) {
                                return (
                                    <Translation
                                        id="AMOUNT_IS_NOT_IN_RANGE_DECIMALS"
                                        values={{ decimals: 2 }}
                                    />
                                );
                            }
                            // TODO:
                            // if (amountLimits) {
                            //     const amount = Number(value);
                            //     if (amountLimits.minFiat && amount < amountLimits.minFiat) {
                            //         return (
                            //             <Translation
                            //                 id="TR_P2P_VALIDATION_ERROR_MINIMUM_FIAT"
                            //                 values={{
                            //                     minimum: amountLimits.minFiat,
                            //                     currency: amountLimits.currency,
                            //                 }}
                            //             />
                            //         );
                            //     }
                            //     if (amountLimits.maxFiat && amount > amountLimits.maxFiat) {
                            //         return (
                            //             <Translation
                            //                 id="TR_P2P_VALIDATION_ERROR_MAXIMUM_FIAT"
                            //                 values={{
                            //                     maximum: amountLimits.maxFiat,
                            //                     currency: amountLimits.currency,
                            //                 }}
                            //             />
                            //         );
                            //     }
                            // }
                        },
                    })}
                    inputState={getInputState(errors.fiatInput, fiatInputValue)}
                    name={fiatInput}
                    maxLength={MAX_LENGTH.AMOUNT}
                    bottomText={<InputError error={errors[fiatInput]} />}
                    innerAddon={
                        <Controller
                            control={control}
                            name={currencySelect}
                            defaultValue={defaultCurrency}
                            render={({ onChange, value }) => (
                                <Select
                                    options={FIAT.currencies
                                        .filter(c => p2pInfo?.supportedCurrencies.has(c))
                                        .map((currency: string) => buildOption(currency))}
                                    isSearchable
                                    value={value}
                                    isClearable={false}
                                    minWidth="58px"
                                    isClean
                                    hideTextCursor
                                    onChange={(selected: any) => {
                                        onChange(selected);
                                        // TODO: setAmountLimits(undefined);
                                    }}
                                />
                            )}
                        />
                    }
                    data-test="@coinmarket/p2p/fiat-input"
                />
            </Left>
            <Middle responsiveSize="LG">
                <StyledIcon responsiveSize="LG" icon="TRANSFER" size={16} />
            </Middle>
            <Right>
                <Input
                    disabled
                    noTopLabel
                    innerAddon={
                        <Controller
                            control={control}
                            name={cryptoSelect}
                            defaultValue={{
                                value: account.symbol,
                                label: account.symbol.toUpperCase(),
                            }}
                            render={({ value }) => (
                                <Select
                                    value={value}
                                    isSearchable
                                    isClearable={false}
                                    formatOptionLabel={(option: any) => (
                                        <Option>
                                            <CoinLogo size={18} symbol={option.value} />
                                            <Label>{option.label}</Label>
                                        </Option>
                                    )}
                                    isClean
                                    isDisabled
                                    hideTextCursor
                                    minWidth="100px"
                                />
                            )}
                        />
                    }
                    data-test="@coinmarket/p2p/crypto-input"
                />
            </Right>
        </Wrapper>
    );
};

export default Inputs;
