import { useQuery } from '@tanstack/react-query';
import {
  getAnnualBudgetBreakdown,
  getCategoryBudgetsByMonth,
} from '../apis/budget';
import { queryKeys } from './keys';

export const useGetCategoryBudgetsByMonth = (
  { year = 0, month = 0 },
  opts = {},
) => {
  return useQuery({
    queryFn: () => getCategoryBudgetsByMonth({ year: year, month: month }),
    queryKey: [queryKeys.budgets, ...(opts.queryOnChange || [])],
    onSuccess: opts.onSuccess || function () {},
  });
};

export const useGetAnnualBudgetBreakdown = (
  { category_id = '', year = 0 } = {},
  opts = {},
) => {
  return useQuery({
    queryFn: () =>
      getAnnualBudgetBreakdown({ category_id: category_id, year: year }),
    queryKey: [queryKeys.budgets, ...(opts.queryOnChange || [])],
    onSuccess: opts.onSuccess || function () {},
  });
};
