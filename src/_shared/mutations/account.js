import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createAccount,
  createAccounts,
  deleteAccount,
  updateAccount,
} from '../apis/account';
import { queryKeys } from '../query';

export const useCreateAccount = (opts = {}) => {
  const queryClient = useQueryClient();

  return useMutation(createAccount, {
    onSuccess: resp => {
      queryClient.invalidateQueries([queryKeys.accounts]);
      queryClient.invalidateQueries([queryKeys.accountsSummary]);
      queryClient.invalidateQueries([queryKeys.metrics]);
      opts.onSuccess && opts.onSuccess(resp);
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
      queryClient.invalidateQueries([queryKeys.transactionGroups]);
      queryClient.invalidateQueries([queryKeys.accountsSummary]);
      queryClient.invalidateQueries([queryKeys.metrics]);
      opts.onSuccess && opts.onSuccess();
    },
  });
};

export const useDeleteAccount = (opts = {}) => {
  const queryClient = useQueryClient();

  return useMutation(deleteAccount, {
    onSuccess: () => {
      // refetch all accounts
      queryClient.invalidateQueries([queryKeys.accounts]);
      queryClient.invalidateQueries([queryKeys.accountsSummary]);
      queryClient.invalidateQueries([queryKeys.metrics]);
      opts.onSuccess && opts.onSuccess();
    },
  });
};

export const useCreateAccounts = (opts = {}) => {
  return useMutation(createAccounts, {
    onSuccess: resp => {
      opts.onSuccess && opts.onSuccess(resp);
    },
  });
};
