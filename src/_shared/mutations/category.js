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

      // category may change name, transaction records need to be reflected
      queryClient.invalidateQueries([queryKeys.transactions]);

      // refetch any transaction that has been fetched before as their category may be affected
      queryClient.invalidateQueries([queryKeys.transaction]);

      // refetch all categories
      queryClient.invalidateQueries([queryKeys.categories]);

      // refetch any single category record
      queryClient.invalidateQueries([queryKeys.category, category_id]);

      opts.onSuccess && opts.onSuccess();
    },
  });
};
