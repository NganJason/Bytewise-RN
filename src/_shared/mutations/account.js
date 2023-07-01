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

      queryClient.invalidateQueries([queryKeys.accounts]);
      queryClient.invalidateQueries([queryKeys.account, account_id]);

      // TODO: Need to invalidate get transactions with accountID also
      opts.onSuccess && opts.onSuccess();
    },
  });
};
