export const CURRENCY_USD = 'USD';
export const CURRENCY_SGD = 'SGD';
export const DEFAULT_CURRENCY = 'SGD';
export const DEFAULT_INVESTMENT_CURRENCY = 'USD';

export const currencies = {
  USD: {
    iso_code: 'us',
    name: 'United States Dollar',
    code: 'USD',
    symbol: '$',
  },
  MYR: { iso_code: 'my', name: 'Malaysia Ringgit', code: 'MYR', symbol: 'RM' },
  SGD: { iso_code: 'sg', name: 'Singapore Dollar', code: 'SGD', symbol: 'S$' },
};

export const supportedBaseCurrencies = [
  currencies.USD,
  currencies.MYR,
  currencies.SGD,
];

export const getCurrencySymbol = (code = DEFAULT_CURRENCY) => {
  return currencies[code]?.symbol || currencies[DEFAULT_CURRENCY].code;
};
