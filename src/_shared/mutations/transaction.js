import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '../query';
import { createTransaction, updateTransaction } from '../apis/transaction';

export const useCreateTransaction = (opts = {}) => {
  const queryClient = useQueryClient();

  return useMutation(createTransaction, {
    onSuccess: () => {
      queryClient.invalidateQueries([queryKeys.transactions]);
      opts.onSuccess && opts.onSuccess();
    },
  });
};

export const useUpdateTransaction = (opts = {}) => {
  const queryClient = useQueryClient();

  return useMutation(updateTransaction, {
    onSuccess: ({ transaction = {} }) => {
      const { transaction_id = '' } = transaction;
      queryClient.invalidateQueries([queryKeys.transactions]);
      queryClient.invalidateQueries([queryKeys.transaction, transaction_id]);
      opts.onSuccess && opts.onSuccess();
    },
  });
};
