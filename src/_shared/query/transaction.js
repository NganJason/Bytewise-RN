import { useQuery } from '@tanstack/react-query';
import {
  getTransactions,
  getTransaction,
  aggrTransactions,
} from '../apis/transaction';
import { queryKeys } from './keys';

export const useAggrTransactions = (
  {
    category_ids = [],
    transaction_types = [],
    transaction_time: { gte = 0, lte = 0 } = {},
  } = {},
  opts = {},
) => {
  return useQuery({
    staleTime: Infinity,
    queryFn: () =>
      aggrTransactions({
        category_ids: category_ids,
        transaction_types: transaction_types,
        transaction_time: { gte, lte },
      }),
    queryKey: [
      queryKeys.transactionsAggr,
      {
        transaction_time: { gte, lte },
        category_ids,
        transaction_types,
      },
    ],
    onSuccess: opts.onSuccess || function () {},
    enabled: opts.enabled,
  });
};

export const useGetTransaction = ({ transaction_id = '' } = {}, opts = {}) => {
  return useQuery({
    staleTime: Infinity,
    queryFn: () =>
      getTransaction({
        transaction_id: transaction_id,
      }),
    queryKey: [queryKeys.transaction, transaction_id],
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
    staleTime: Infinity,
    queryFn: () =>
      getTransactions({
        category_id: category_id,
        transaction_type: transaction_type,
        transaction_time: { gte, lte },
        paging: { limit, page },
      }),
    queryKey: [
      queryKeys.transactions,
      {
        transaction_time: { gte: gte, lte: lte },
      },
    ],
    onSuccess: opts.onSuccess || function () {},
  });
};
