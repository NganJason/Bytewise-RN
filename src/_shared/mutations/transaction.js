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
      const {
        account_id = '',
        from_account_id = '',
        to_account_id = '',
      } = transaction;

      // refetch all transactions in the same time range
      queryClient.invalidateQueries([queryKeys.transactionGroups]);

      queryClient.invalidateQueries([queryKeys.transactionsSum]);

      queryClient.invalidateQueries([queryKeys.categoryTransactions]);

      // refetch all accounts since the amount for a specific account has changed
      queryClient.invalidateQueries([queryKeys.accounts]);

      queryClient.invalidateQueries([queryKeys.transactionsSummary]);

      // refetch account with given account_id
      if (account_id !== '') {
        queryClient.invalidateQueries([queryKeys.account, account_id]);
      }

      if (from_account_id !== '') {
        queryClient.invalidateQueries([queryKeys.account, from_account_id]);
      }

      if (to_account_id !== '') {
        queryClient.invalidateQueries([queryKeys.account, to_account_id]);
      }

      queryClient.invalidateQueries([queryKeys.categoriesBudget]);

      opts.onSuccess && opts.onSuccess();
    },
  });
};

export const useUpdateTransaction = (opts = {}) => {
  const queryClient = useQueryClient();

  return useMutation(updateTransaction, {
    onSuccess: ({ transaction = {} }) => {
      const {
        transaction_id = '',
        account_id = '',
        from_account_id = '',
        to_account_id = '',
      } = transaction;

      // refetch all transactions
      queryClient.invalidateQueries([queryKeys.transactionGroups]);

      queryClient.invalidateQueries([queryKeys.transactionsSum]);

      queryClient.invalidateQueries([queryKeys.categoryTransactions]);

      // refetch any single transaction record
      queryClient.invalidateQueries([queryKeys.transaction, transaction_id]);

      // refetch all accounts since the amount for a specific account has changed
      queryClient.invalidateQueries([queryKeys.accounts]);

      queryClient.invalidateQueries([queryKeys.transactionsSummary]);

      // refetch account with given account_id
      if (account_id !== '') {
        queryClient.invalidateQueries([queryKeys.account, account_id]);
      }

      if (from_account_id !== '') {
        queryClient.invalidateQueries([queryKeys.account, from_account_id]);
      }

      if (to_account_id !== '') {
        queryClient.invalidateQueries([queryKeys.account, to_account_id]);
      }

      queryClient.invalidateQueries([queryKeys.categoriesBudget]);

      opts.onSuccess && opts.onSuccess();
    },
  });
};

export const useDeleteTransaction = (opts = {}) => {
  const queryClient = useQueryClient();
  const {
    account_id = '',
    from_account_id = '',
    to_account_id = '',
  } = opts?.meta || {};

  return useMutation(deleteTransaction, {
    onSuccess: () => {
      queryClient.invalidateQueries([queryKeys.transactionGroups]);

      queryClient.invalidateQueries([queryKeys.transactionsSum]);

      queryClient.invalidateQueries([queryKeys.categoryTransactions]);

      queryClient.invalidateQueries([queryKeys.accounts]);

      queryClient.invalidateQueries([queryKeys.transactionsSummary]);

      if (account_id !== '') {
        queryClient.invalidateQueries([queryKeys.account, account_id]);
      }

      if (from_account_id !== '') {
        queryClient.invalidateQueries([queryKeys.account, from_account_id]);
      }

      if (to_account_id !== '') {
        queryClient.invalidateQueries([queryKeys.account, to_account_id]);
      }

      queryClient.invalidateQueries([queryKeys.categoriesBudget]);
      opts.onSuccess && opts.onSuccess();
    },
  });
};
