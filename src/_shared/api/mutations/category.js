import { useMutation, useQueryClient } from '@tanstack/react-query';

import { createCategory } from '../dao/category';
import { queryKeys } from '../query';

export const useCreateCategory = (opts = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async category => await createCategory(category),
    ...opts,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.categories] });
      opts.onSuccess && opts.onSuccess();
    },
  });
};
