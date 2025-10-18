export const parseCurrency = (value) => {
    if (typeof value === 'number') {
        return value;
    }
    if (typeof value === 'string') {
        const normalized = value.replace(/\./g, '').replace(',', '');
        const parsed = Number(normalized);
        return isNaN(parsed) ? 0 : parsed;
    }
    return 0;
};

const brlFormatter = new Intl.NumberFormat('pt-BR', {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2
});

export const formatCurrencyFromCents = (value) => {
    const valueInReais = value / 100;
    return brlFormatter.format(valueInReais);
}