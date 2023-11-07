import { getCategoriesBudget, getCategoryBudget } from '../apis/budget';
import { queryKeys, useQueryWrapper } from './keys';

export const useGetCategoriesBudget = (
  { category_ids = [], budget_date = '' },
  opts = {},
) => {
  return useQueryWrapper({
    queryFn: () =>
      getCategoriesBudget({
        category_ids: category_ids,
        budget_date: budget_date,
      }),
    queryKey: [queryKeys.categoriesBudget, budget_date, category_ids],
    onSuccess: opts.onSuccess || function () {},
    enabled: opts.enabled,
  });
};

export const useGetCategoryBudget = (
  { category_id = '', budget_date = '' },
  opts = {},
) => {
  return useQueryWrapper({
    queryFn: () =>
      getCategoryBudget({
        category_id: category_id,
        budget_date: budget_date,
      }),
    queryKey: [queryKeys.categoriesBudget, budget_date, category_id],
    onSuccess: opts.onSuccess || function () {},
    enabled: opts.enabled,
  });
};
