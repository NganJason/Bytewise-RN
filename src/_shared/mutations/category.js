import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '../query/keys';
import { createCategory, updateCategory } from '../apis/category';

export const useCreateCategory = (opts = {}) => {
  const queryClient = useQueryClient();

  return useMutation(createCategory, {
    onSuccess: () => {
      // refetch all categories as there is a new category
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

      // refetch all categories
      queryClient.invalidateQueries([queryKeys.categories]);

      // refetch any single category record
      queryClient.invalidateQueries([queryKeys.category, category_id]);

      queryClient.invalidateQueries([queryKeys.categoriesBudget]);

      opts.onSuccess && opts.onSuccess();
    },
  });
};
