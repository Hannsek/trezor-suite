export const getDecimalSeparator = (locale: string) => {
    const numberWithDecimalSeparator = 1.1;

    return Intl.NumberFormat(locale)
        .formatToParts(numberWithDecimalSeparator)
        .find(part => part.type === 'decimal')?.value;
};

export const getGroupSeparator = (locale: string) => {
    const numberWithGroupSeparator = 1000;

    return Intl.NumberFormat(locale)
        .formatToParts(numberWithGroupSeparator)
        .find(part => part.type === 'group')?.value;
};
