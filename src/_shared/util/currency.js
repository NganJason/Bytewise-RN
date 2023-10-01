import CountryFlag from 'react-native-country-flag';

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

export const supportedCurrencies = [
  currencies.USD,
  currencies.MYR,
  currencies.SGD,
];

export const getCurrencySymbol = (code = DEFAULT_CURRENCY) => {
  return currencies[code]?.symbol || currencies[DEFAULT_CURRENCY].code;
};

export const getSupportedCurrencyOptions = (baseCurrency = false) => {
  let options = [];
  let supported = baseCurrency ? supportedBaseCurrencies : supportedCurrencies;

  supported.map(currency => {
    currency.leftIcon = (
      <CountryFlag
        isoCode={currency.iso_code}
        size={20}
        style={{ marginRight: 10 }}
      />
    );
    options.push(currency);
  });
  options.sort((a, b) => a.name.localeCompare(b.name));

  return options;
};
