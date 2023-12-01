import { Amount } from '../object';
import { useGetAccounts } from '../query';
import { isAccountTypeAsset, isAccountTypeDebt } from '../util';

const useAccounts = () => {
  const getAccounts = useGetAccounts({});
  const { accounts = [] } = getAccounts?.data || {};

  const getSortedAssetAccounts = () => {
    let assetAccounts = accounts.filter(d =>
      isAccountTypeAsset(d?.account_type || 0),
    );
    assetAccounts.sort((a, b) => b.balance - a.balance);
    return assetAccounts;
  };

  const getSortedDebtAccounts = () => {
    let debtAccounts = accounts.filter(d =>
      isAccountTypeDebt(d?.account_type || 0),
    );
    return debtAccounts.sort((a, b) => a.balance - b.balance);
  };

  const getTotalAsset = () => {
    let { asset_value: asset = 0, currency = '' } = getAccounts?.data || {};
    return new Amount(asset, currency);
  };

  const getTotalDebt = () => {
    let { debt_value: debt = 0, currency = '' } = getAccounts?.data || {};
    return new Amount(debt, currency);
  };

  const getErrors = () => {
    return [getAccounts];
  };

  return {
    getSortedAssetAccounts,
    getSortedDebtAccounts,
    getTotalAsset,
    getTotalDebt,
    getErrors,
    isLoading: getAccounts.isLoading,
  };
};

export default useAccounts;
