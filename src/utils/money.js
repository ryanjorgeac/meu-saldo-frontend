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