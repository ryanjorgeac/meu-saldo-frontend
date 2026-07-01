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

const MONEY_INPUT_REGEX = /^(?:\d+|\d{1,3}(?:\.\d{3})+)(?:[.,]\d{1,2})?$/;

export const parseMoneyInputToCents = (value) => {
    if (typeof value !== 'string') {
        throw new Error('Invalid money input');
    }

    const sanitized = value.trim().replace(/\s/g, '');

    if (!sanitized) {
        throw new Error('Invalid money input');
    }

    if (!MONEY_INPUT_REGEX.test(sanitized)) {
        throw new Error('Invalid money input');
    }

    const normalized = sanitized.includes(',')
        ? sanitized.replace(/\./g, '').replace(',', '.')
        : sanitized;
    const [integerPart, fractionalPart = ''] = normalized.split('.');
    const cents = `${integerPart}${fractionalPart.padEnd(2, '0')}`;

    return Number(cents);
};

export const formatMoneyInput = (value) => {
    if (value == null || value === '') {
        return '';
    }

    const digits = String(value).replace(/\D/g, '').slice(0, 13);

    if (!digits) {
        return '';
    }

    return formatCurrencyFromCents(Number(digits));
};