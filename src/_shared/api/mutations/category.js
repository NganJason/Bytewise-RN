import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createCategoryApi } from '../apis/category';

import { queryKeys } from '../query';

export const useCreateCategory = (opts = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async createCategoryReq =>
      await createCategoryApi(createCategoryReq),
    ...opts,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.getCategories] });
      opts.onSuccess && opts.onSuccess();
    },
  });
};
