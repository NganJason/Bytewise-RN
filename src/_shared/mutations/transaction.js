import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '../query';
import { createTransaction, updateTransaction } from '../apis/transaction';

export const useCreateTransaction = (opts = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      category_id = '',
      amount = '',
      transaction_type = 0,
      transaction_time = 0,
      note = '',
    } = {}) => {
      await createTransaction({
        category_id: category_id,
        amount: amount,
        transaction_type: transaction_type,
        transaction_time: transaction_time,
        note: note,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.getTransactions] });
      opts.onSuccess && opts.onSuccess();
    },
  });
};

export const useUpdateTransaction = (opts = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      transaction_id = '',
      category_id = '',
      amount = '',
      transaction_type = 0,
      transaction_time = 0,
      note = '',
    } = {}) => {
      await updateTransaction({
        transaction_id: transaction_id,
        category_id: category_id,
        amount: amount,
        transaction_type: transaction_type,
        transaction_time: transaction_time,
        note: note,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.getTransactions] });
      opts.onSuccess && opts.onSuccess();
    },
  });
};
