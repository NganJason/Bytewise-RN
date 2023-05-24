import { useMutation, useQueryClient } from '@tanstack/react-query';

import { queryKeys } from '../query';
import { createCategory } from '../apis/category';

export const useCreateCategory = (opts = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ category_name = '', category_type = 0 } = {}) => {
      await createCategory({
        category_name: category_name,
        category_type: category_type,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.getCategories] });
      opts.onSuccess && opts.onSuccess();
    },
  });
};
