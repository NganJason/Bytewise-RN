import { useMutation, useQueryClient } from '@tanstack/react-query';
import { setBudget } from '../apis/budget';

import { queryKeys } from '../query';

export const useSetBudget = (opts = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      category_id = '',
      year = 0,
      default_budget = null,
      monthly_budget = null,
      budget_config = null,
    } = {}) => {
      await setBudget({
        category_id: category_id,
        year: year,
        default_budget: default_budget,
        monthly_budget: monthly_budget,
        budget_config: budget_config,
      });
    },
    ...opts,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [queryKeys.getAnnualBudgetBreakdown],
      });
      opts.onSuccess && opts.onSuccess();
    },
  });
};
