import { getBudget, getBudgets, getCategoriesBudget } from '../apis/budget';
import { queryKeys, useQueryWrapper } from './keys';

export const useGetBudget = ({ budget_id = '', date = '' }, opts = {}) => {
  return useQueryWrapper({
    queryFn: () => getBudget({ budget_id: budget_id, date: date }),
    queryKey: [queryKeys.budget, budget_id],
    onSuccess: opts.onSuccess || function () {},
    enabled: opts.enabled,
  });
};

export const useGetBudgets = ({ date = '' }, opts = {}) => {
  return useQueryWrapper({
    queryFn: () => getBudgets({ date: date }),
    queryKey: [queryKeys.budgets, { date: date }],
    onSuccess: opts.onSuccess || function () {},
    enabled: opts.enabled,
  });
};

export const useGetCategoriesBudget = (
  { category_ids = [], budget_date = '', timezone = '' },
  opts = {},
) => {
  return useQueryWrapper({
    queryFn: () =>
      getCategoriesBudget({
        category_ids: category_ids,
        budget_date: budget_date,
        timezone: timezone,
      }),
    queryKey: [queryKeys.categoriesBudget, budget_date, category_ids],
    onSuccess: opts.onSuccess || function () {},
    enabled: opts.enabled,
  });
};
