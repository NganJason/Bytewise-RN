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
      const { category_id = '', category_type = 0 } = category;
      queryClient.invalidateQueries([queryKeys.transactions]);
      // refetch any transaction that has been fetched before, no way of knowing by category_id
      queryClient.invalidateQueries([queryKeys.transaction]);
      // can invalidate by category_type because category cannot change category_type
      queryClient.invalidateQueries([queryKeys.categories, category_type]);
      queryClient.invalidateQueries([queryKeys.category, category_id]);
      opts.onSuccess && opts.onSuccess();
    },
  });
};
