import {
  getTransactions,
  getTransaction,
  aggrTransactions,
} from '../apis/transaction';
import { queryKeys, useQueryWrapper } from './keys';

export const useAggrTransactions = (
  {
    category_ids = [],
    transaction_types = [],
    transaction_time: { gte = 0, lte = 0 } = {},
  } = {},
  opts = {},
) => {
  return useQueryWrapper({
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
  return useQueryWrapper({
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
    account_id = '',
    category_id = '',
    transaction_type = 0,
    transaction_time: { gte = 0, lte = 0 } = {},
    paging: { limit = 500, page = 1 } = {},
  } = {},
  opts = {},
) => {
  return useQueryWrapper({
    queryFn: () =>
      getTransactions({
        account_id: account_id,
        category_id: category_id,
        transaction_type: transaction_type,
        transaction_time: { gte, lte },
        paging: { limit, page },
      }),
    queryKey: [
      queryKeys.transactions,
      {
        account_id: account_id,
        category_id: category_id,
        transaction_time: { gte, lte },
      },
    ],
    onSuccess: opts.onSuccess || function () {},
  });
};
