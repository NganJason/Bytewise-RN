import CountryFlag from 'react-native-country-flag';
import currencyList from 'iso-currencies';
import iso from 'iso-country-currency';
import { capitalize } from './string';

export const CURRENCY_USD = 'USD';
export const CURRENCY_SGD = 'SGD';
export const CURRENCY_MYR = 'MYR';
export let DEFAULT_CURRENCY = CURRENCY_SGD;
export const DEFAULT_INVESTMENT_CURRENCY = CURRENCY_USD;

export const supportedBaseCurrencies = [
  CURRENCY_USD,
  CURRENCY_SGD,
  CURRENCY_MYR,
];

export const getCurrencyMap = (code = DEFAULT_CURRENCY) => {
  if (code === '') {
    code = DEFAULT_CURRENCY;
  }

  let { name = '', symbol = '' } = currencyList.list()[code] || {};
  let isos = iso.getAllISOByCurrencyOrSymbol('currency', code) || [];
  let isoCode = isos.length > 0 ? isos[0] : '';
  if (code === CURRENCY_USD) {
    isoCode = 'US';
  }
  return {
    iso_code: isoCode,
    name: capitalize(name),
    code: code,
    symbol: symbol,
    countryFlag: <CountryFlag isoCode={isoCode} size={20} />,
  };
};
