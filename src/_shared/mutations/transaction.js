import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '../query';
import { createTransaction, updateTransaction } from '../apis/transaction';

export const useCreateTransaction = (opts = {}) => {
  const queryClient = useQueryClient();

  return useMutation(createTransaction, {
    onSuccess: () => {
      // refetch all transactions in the same time range
      queryClient.invalidateQueries([queryKeys.transactions]);

      // recompute aggregations with new transaction amount
      queryClient.invalidateQueries([queryKeys.transactionsAggr]);

      opts.onSuccess && opts.onSuccess();
    },
  });
};

export const useUpdateTransaction = (opts = {}) => {
  const queryClient = useQueryClient();

  return useMutation(updateTransaction, {
    onSuccess: ({ transaction = {} }) => {
      const { transaction_id = '' } = transaction;

      // refetch all transactions
      queryClient.invalidateQueries([queryKeys.transactions]);

      // recompute aggregations as transaction amount may have changed
      queryClient.invalidateQueries([queryKeys.transactionsAggr]);

      // refetch any single transaction record
      queryClient.invalidateQueries([queryKeys.transaction, transaction_id]);

      opts.onSuccess && opts.onSuccess();
    },
  });
};
