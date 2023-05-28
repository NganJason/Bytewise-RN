import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '../query/keys';
import { createCategory, updateCategory } from '../apis/category';

export const useCreateCategory = (opts = {}) => {
  const queryClient = useQueryClient();

  return useMutation(createCategory, {
    onSuccess: () => {
      queryClient.invalidateQueries([queryKeys.categories]);
      opts.onSuccess && opts.onSuccess();
    },
  });
};

export const useUpdateCategory = (opts = {}) => {
  const queryClient = useQueryClient();

  return useMutation(updateCategory, {
    onSuccess: ({ category = {} }) => {
      const { category_id = '' } = category;
      queryClient.invalidateQueries([queryKeys.transactions]);
      queryClient.invalidateQueries([queryKeys.categories]);
      queryClient.invalidateQueries([queryKeys.category, category_id]);
      opts.onSuccess && opts.onSuccess();
    },
  });
};
