import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '../query';
import {
  createCategories,
  createCategory,
  deleteCategory,
  updateCategory,
} from '../apis/category';

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

      queryClient.invalidateQueries([queryKeys.transactionGroups]);

      opts.onSuccess && opts.onSuccess();
    },
  });
};

export const useDeleteCategory = (opts = {}) => {
  const queryClient = useQueryClient();

  return useMutation(deleteCategory, {
    onSuccess: () => {
      // refetch all categories
      queryClient.invalidateQueries([queryKeys.categories]);

      queryClient.invalidateQueries([queryKeys.categoriesBudget]);

      queryClient.invalidateQueries([queryKeys.transactionGroups]);

      opts.onSuccess && opts.onSuccess();
    },
  });
};

export const useCreateCategories = (opts = {}) => {
  return useMutation(createCategories, {
    onSuccess: resp => {
      opts.onSuccess && opts.onSuccess(resp);
    },
  });
};
