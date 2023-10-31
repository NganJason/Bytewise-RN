import { useGetCurrencies } from '../query';
import { getCurrencyMap } from '../util';

const useGetCurrencyMap = () => {
  const getCurrencies = useGetCurrencies();

  const getSupportedCurrencies = () => {
    let { currencies = [] } = getCurrencies?.data || {};
    let supportedCurrencies = [];

    currencies.map(c => {
      supportedCurrencies.push(getCurrencyMap(c));
    });
    return supportedCurrencies;
  };

  return {
    getSupportedCurrencies,
  };
};

export default useGetCurrencyMap;
