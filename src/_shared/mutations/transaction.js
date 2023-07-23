import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '../query';
import {
  createTransaction,
  deleteTransaction,
  updateTransaction,
} from '../apis/transaction';

export const useCreateTransaction = (opts = {}) => {
  const queryClient = useQueryClient();

  return useMutation(createTransaction, {
    onSuccess: ({ transaction = {} }) => {
      const { account_id = '' } = transaction;

      // refetch all transactions in the same time range
      queryClient.invalidateQueries([queryKeys.transactions]);

      // recompute aggregations with new transaction amount
      queryClient.invalidateQueries([queryKeys.transactionsAggr]);

      // refetch all accounts since the amount for a specific account has changed
      queryClient.invalidateQueries([queryKeys.accounts]);

      // refetch account with given account_id
      queryClient.invalidateQueries([queryKeys.account, account_id]);

      opts.onSuccess && opts.onSuccess();
    },
  });
};

export const useUpdateTransaction = (opts = {}) => {
  const queryClient = useQueryClient();

  return useMutation(updateTransaction, {
    onSuccess: ({ transaction = {} }) => {
      const { transaction_id = '', account_id = '' } = transaction;

      // refetch all transactions
      queryClient.invalidateQueries([queryKeys.transactions]);

      // recompute aggregations as transaction amount may have changed
      queryClient.invalidateQueries([queryKeys.transactionsAggr]);

      // refetch any single transaction record
      queryClient.invalidateQueries([queryKeys.transaction, transaction_id]);

      // refetch all accounts since the amount for a specific account has changed
      queryClient.invalidateQueries([queryKeys.accounts]);

      // refetch account with given account_id
      queryClient.invalidateQueries([queryKeys.account, account_id]);

      opts.onSuccess && opts.onSuccess();
    },
  });
};

export const useDeleteTransaction = (opts = {}) => {
  const queryClient = useQueryClient();
  const { account_id = '' } = opts?.meta || {};

  return useMutation(deleteTransaction, {
    onSuccess: () => {
      queryClient.invalidateQueries([queryKeys.transactions]);
      queryClient.invalidateQueries([queryKeys.transactionsAggr]);
      queryClient.invalidateQueries([queryKeys.accounts]);
      queryClient.invalidateQueries([queryKeys.account, account_id]);
      opts.onSuccess && opts.onSuccess();
    },
  });
};
