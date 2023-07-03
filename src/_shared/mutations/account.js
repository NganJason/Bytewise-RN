import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createAccount, updateAccount } from '../apis/account';
import { queryKeys } from '../query';

export const useCreateAccount = (opts = {}) => {
  const queryClient = useQueryClient();

  return useMutation(createAccount, {
    onSuccess: () => {
      queryClient.invalidateQueries([queryKeys.accounts]);
      opts.onSuccess && opts.onSuccess();
    },
  });
};

export const useUpdateAccount = (opts = {}) => {
  const queryClient = useQueryClient();

  return useMutation(updateAccount, {
    onSuccess: ({ account = {} }) => {
      const { account_id = '' } = account;

      // refetch all accounts
      queryClient.invalidateQueries([queryKeys.accounts]);

      // refetch account info
      queryClient.invalidateQueries([queryKeys.account, account_id]);

      queryClient.invalidateQueries([queryKeys.transactions]);

      // refetch all transactions since account name might have changed
      // queryClient.invalidateQueries([queryKeys.transactions]);
      opts.onSuccess && opts.onSuccess();
    },
  });
};
