import { useQuery } from '@tanstack/react-query';

export const queryKeys = {
  user: 'user',

  category: 'category',
  categories: 'categories',
  categoryTransactions: 'categoryTransactions',

  transaction: 'transaction',
  transactions: 'transactions',
  transactionGroups: 'transaction_groups',
  transactionsSum: 'transactions_sum',
  transactionsSummary: 'transactions_summary',

  budget: 'budget',
  budgets: 'budgets',
  categoriesBudget: 'categories_budget',
  categoryBudget: 'category_budget',

  account: 'account',
  accounts: 'accounts',
  accountsSummary: 'accountsSummary',

  securities: 'securities',
  holding: 'holding',
  lot: 'lot',
  lots: 'lots',

  currencies: 'currencies',
  metrics: 'metrics',
};

export const useQueryWrapper = (queryOpts = {}) => {
  const query = useQuery(queryOpts);

  return {
    ...query,
    isLoading: query.isLoading && query.fetchStatus !== 'idle',
  };
};
