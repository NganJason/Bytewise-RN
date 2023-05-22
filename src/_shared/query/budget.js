import { useQuery } from '@tanstack/react-query';
import {
  getAnnualBudgetBreakdown,
  getCategoryBudgetsByMonth,
} from '../apis/budget';
import { queryKeys } from './keys';

export const useGetCategoryBudgetsByMonth = ({ year = 0, month = 0 }) => {
  return useQuery({
    queryFn: () => getCategoryBudgetsByMonth({ year: year, month: month }),
    queryKey: [queryKeys.getCategoryBudgetsByMonth],
  });
};

export const useGetAnnualBudgetBreakdown = ({ category_id = '', year = 0 }) => {
  return useQuery({
    queryFn: () =>
      getAnnualBudgetBreakdown({ category_id: category_id, year: year }),
    queryKey: [queryKeys.getAnnualBudgetBreakdown],
  });
};
