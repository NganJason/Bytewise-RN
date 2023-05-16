import { useMutation, useQueryClient } from '@tanstack/react-query';

import { queryKeys } from '../query';

export const useCreateCategory = (opts = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async _ => {},
    ...opts,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.getCategories] });
      opts.onSuccess && opts.onSuccess();
    },
  });
};
