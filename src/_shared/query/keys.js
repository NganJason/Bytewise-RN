import { useQuery } from '@tanstack/react-query';

export const queryKeys = {
  user: 'user',

  category: 'category',
  categories: 'categories',
  categoryTransactions: 'categoryTransactions',

  transaction: 'transaction',
  transactions: 'transactions',
  transactionGroups: 'transaction_groups',
  transactionsAggr: 'transactions_aggr',
  transactionsSum: 'transactions_sum',

  budget: 'budget',
  budgets: 'budgets',
  categoriesBudget: 'categories_budget',

  account: 'account',
  accounts: 'accounts',

  securities: 'securities',
  holding: 'holding',
  lot: 'lot',
  lots: 'lots',
};

export const useQueryWrapper = (queryOpts = {}) => {
  const query = useQuery(queryOpts);

  return {
    ...query,
    isLoading: query.isLoading && query.fetchStatus !== 'idle',
  };
};
