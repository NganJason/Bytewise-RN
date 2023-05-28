import { useMutation, useQueryClient } from '@tanstack/react-query';

import { createCategory, updateCategory } from '../apis/category';

export const useCreateCategory = (opts = {}) => {
  const queryClient = useQueryClient();

  return useMutation(createCategory, {
    onSuccess: () => {
      queryClient.invalidateQueries(['categories']);
      opts.onSuccess && opts.onSuccess();
    },
  });
};

export const useUpdateCategory = (opts = {}) => {
  const queryClient = useQueryClient();

  return useMutation(updateCategory, {
    onSuccess: ({ category = {} }) => {
      const { category_id = '' } = category;
      queryClient.invalidateQueries(['transactions']);
      queryClient.invalidateQueries(['categories']);
      queryClient.invalidateQueries(['category', category_id]);
      opts.onSuccess && opts.onSuccess();
    },
  });
};
