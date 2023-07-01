import { queryKeys, useQueryWrapper } from './keys';
import { getAccount, getAccounts } from '../apis/account';

export const useGetAccount = ({ account_id = '' } = {}, opts = {}) => {
  return useQueryWrapper({
    queryFn: () => getAccount({ account_id: account_id }),
    queryKey: [queryKeys.account, account_id],
    onSuccess: opts.onSuccess || function () {},
    enabled: opts.enabled,
  });
};

export const useGetAccounts = ({ account_type = 0 } = {}, opts = {}) => {
  return useQueryWrapper({
    queryFn: () => getAccounts({ account_type: account_type }),
    queryKey: [queryKeys.accounts, account_type],
    onSuccess: opts.onSuccess || function () {},
    enabled: opts.enabled,
  });
};
