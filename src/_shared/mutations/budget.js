import { useMutation, useQueryClient } from '@tanstack/react-query';
import { setBudget } from '../apis/budget';

import { queryKeys } from '../query';

export const useSetBudget = (opts = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      budget_id = null,
      budget_name = '',
      budget_type = 0,
      budget_amount = '0',
      category_ids = [],
      range_start_date = '',
      range_end_date = '',
    } = {}) => {
      await setBudget({
        budget_id: budget_id,
        budget_name: budget_name,
        budget_type: budget_type,
        budget_amount: budget_amount,
        category_ids: category_ids,
        range_start_date: range_start_date,
        range_end_date: range_end_date,
      });
    },
    ...opts,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [queryKeys.budgets],
      });
      opts.onSuccess && opts.onSuccess();
    },
  });
};
