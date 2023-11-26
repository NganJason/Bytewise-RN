import {
  getTransactions,
  getTransaction,
  sumTransactions,
  getTransactionGroups,
  getTransactionsSummary,
} from '../apis/transaction';
import { queryKeys, useQueryWrapper } from './keys';

export const useGetTransactionsSummary = (
  { unit = 0, interval = 0 } = {},
  opts = {},
) => {
  return useQueryWrapper({
    queryFn: () =>
      getTransactionsSummary({
        unit: unit,
        interval: interval,
      }),
    queryKey: [queryKeys.transactionsSummary, unit, interval],
    onSuccess: opts.onSuccess || function () {},
    enabled: opts.enabled,
  });
};

export const useSumTransactions = (
  { transaction_type = null, transaction_time: { gte = 0, lte = 0 } = {} } = {},
  opts = {},
) => {
  return useQueryWrapper({
    queryFn: () =>
      sumTransactions({
        transaction_type: transaction_type,
        transaction_time: { gte, lte },
      }),
    queryKey: [
      queryKeys.transactionsSum,
      {
        transaction_time: { gte, lte },
        transaction_type,
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
    ...opts,
  });
};

export const useGetTransactions = (
  {
    account_id = null,
    category_id = null,
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

export const useGetTransactionGroups = (
  {
    account_id = null,
    category_id = null,
    category_ids = null,
    transaction_type = null,
    transaction_time: { gte = 0, lte = 0 } = {},
    paging: { limit = 500, page = 1 } = {},
  } = {},
  opts = {},
) => {
  return useQueryWrapper({
    queryFn: () =>
      getTransactionGroups({
        account_id: account_id,
        category_id: category_id,
        category_ids: category_ids,
        transaction_type: transaction_type,
        transaction_time: { gte, lte },
        paging: { limit, page },
      }),
    queryKey: [
      queryKeys.transactionGroups,
      {
        account_id: account_id,
        category_id: category_id,
        category_ids: category_ids,
        transaction_time: { gte, lte },
      },
    ],
    onSuccess: opts.onSuccess || function () {},
  });
};
