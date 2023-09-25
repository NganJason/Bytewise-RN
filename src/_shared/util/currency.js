export const CURRENCY_USD = 'USD';
export const CURRENCY_SGD = 'SGD';

export const currencies = {
  USD: { iso_code: 'us', name: 'United States Dollar', code: 'USD' },
  MYR: { iso_code: 'my', name: 'Malaysia Ringgit', code: 'MYR' },
  SGD: { iso_code: 'sg', name: 'Singapore Dollar', code: 'SGD' },
};

export const supportedBaseCurrencies = [
  currencies.USD,
  currencies.MYR,
  currencies.SGD,
];

export const getCurrencySymbol = (code = CURRENCY_SGD) => {
  switch (code) {
    case CURRENCY_SGD:
      return 'S$';
    case CURRENCY_USD:
      return '$';
    default:
      return '$';
  }
};
