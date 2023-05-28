import { useQuery } from '@tanstack/react-query';
import { getTransactions, getTransaction } from '../apis/transaction';

export const useGetTransaction = ({ transaction_id = '' } = {}, opts = {}) => {
  return useQuery({
    queryFn: () =>
      getTransaction({
        transaction_id: transaction_id,
      }),
    queryKey: ['transactions', transaction_id],
    onSuccess: opts.onSuccess || function () {},
    enabled: opts.enabled,
  });
};

export const useGetTransactions = (
  {
    category_id = '',
    transaction_type = 0,
    transaction_time: { gte = 0, lte = 0 } = {},
    paging: { limit = 500, page = 1 } = {},
  } = {},
  opts = {},
) => {
  return useQuery({
    queryFn: () =>
      getTransactions({
        category_id: category_id,
        transaction_type: transaction_type,
        transaction_time: {
          gte: gte,
          lte: lte,
        },
        paging: {
          limit: limit,
          page: page,
        },
      }),
    queryKey: ['transactions', { gte: gte, lte: lte }],
    onSuccess: opts.onSuccess || function () {},
  });
};
