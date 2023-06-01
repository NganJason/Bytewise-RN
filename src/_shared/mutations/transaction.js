import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '../query';
import { createTransaction, updateTransaction } from '../apis/transaction';
import { getMonth, getUnixRangeOfMonth, getYear } from '../util/date';

export const useCreateTransaction = (opts = {}) => {
  const queryClient = useQueryClient();

  return useMutation(createTransaction, {
    onSuccess: ({ transaction = {} }) => {
      const { transaction_time = 0 } = transaction;
      const d = new Date(transaction_time);
      const [gte, lte] = getUnixRangeOfMonth(getYear(d), getMonth(d));

      queryClient.invalidateQueries([
        queryKeys.transactions,
        { gte: gte, lte: lte },
      ]);
      queryClient.invalidateQueries([
        queryKeys.transactionsAggr,
        { gte: gte, lte: lte },
      ]);
      opts.onSuccess && opts.onSuccess();
    },
  });
};

export const useUpdateTransaction = (opts = {}) => {
  const queryClient = useQueryClient();

  return useMutation(updateTransaction, {
    onSuccess: ({ transaction = {} }) => {
      const { transaction_id = '', transaction_time = 0 } = transaction;
      const d = new Date(transaction_time);
      const [gte, lte] = getUnixRangeOfMonth(getYear(d), getMonth(d));

      queryClient.invalidateQueries([
        queryKeys.transactions,
        { gte: gte, lte: lte },
      ]);
      queryClient.invalidateQueries([
        queryKeys.transactionsAggr,
        { gte: gte, lte: lte },
      ]);
      queryClient.invalidateQueries([queryKeys.transaction, transaction_id]);
      opts.onSuccess && opts.onSuccess();
    },
  });
};
