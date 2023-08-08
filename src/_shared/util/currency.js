export const CURRENCY_USD = 'USD';
export const CURRENCY_SGD = 'SGD';

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
