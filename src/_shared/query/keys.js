import { useQuery } from '@tanstack/react-query';

export const queryKeys = {
  categories: 'categories',
  transactions: 'transactions',
  category: 'category',
  transaction: 'transaction',
  transactionsAggr: 'transactions_aggr',
  budgets: 'budgets',
};

export const useQueryWrapper = (queryOpts = {}) => {
  const query = useQuery(queryOpts);

  return {
    ...query,
    isLoading: query.isLoading && query.fetchStatus !== 'idle',
  };
};
