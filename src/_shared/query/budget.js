import { useQuery } from '@tanstack/react-query';
import { getBudget, getBudgets } from '../apis/budget';
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
  return useQuery({
    queryFn: () => getBudgets({ date: date }),
    queryKey: [queryKeys.budgets, { date: date }],
    onSuccess: opts.onSuccess || function () {},
    enabled: opts.enabled,
  });
};
