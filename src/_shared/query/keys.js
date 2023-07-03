import { useQuery } from '@tanstack/react-query';

export const queryKeys = {
  user: 'user',

  category: 'category',
  categories: 'categories',

  transaction: 'transaction',
  transactions: 'transactions',
  transactionsAggr: 'transactions_aggr',

  budget: 'budget',
  budgets: 'budgets',

  account: 'account',
  accounts: 'accounts',

  securities: 'securities',
};

export const useQueryWrapper = (queryOpts = {}) => {
  const query = useQuery(queryOpts);

  return {
    ...query,
    isLoading: query.isLoading && query.fetchStatus !== 'idle',
  };
};
