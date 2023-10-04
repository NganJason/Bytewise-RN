import CountryFlag from 'react-native-country-flag';
import currencyList from 'iso-currencies';
import iso from 'iso-country-currency';

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

export const getCurrencyMap = code => {
  let { name = '', symbol = '' } = currencyList.list()[code] || {};
  let isos = iso.getAllISOByCurrencyOrSymbol('currency', code) || [];
  let isoCode = isos.length > 0 ? isos[0] : '';
  if (code === 'USD') {
    isoCode = 'US';
  }
  return {
    iso_code: isoCode,
    name: name,
    code: code,
    symbol: symbol,
    countryFlag: <CountryFlag isoCode={isoCode} size={20} />,
  };
};
