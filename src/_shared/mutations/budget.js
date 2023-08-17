import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createBudget, deleteBudget, updateBudget } from '../apis/budget';
import { queryKeys } from '../query';

export const useCreateBudget = (opts = {}) => {
  const queryClient = useQueryClient();

  return useMutation(createBudget, {
    onSuccess: resp => {
      queryClient.invalidateQueries([queryKeys.categoriesBudget]);
      opts.onSuccess && opts.onSuccess(resp);
    },
  });
};

export const useUpdateBudget = (opts = {}) => {
  const queryClient = useQueryClient();

  return useMutation(updateBudget, {
    onSuccess: resp => {
      queryClient.invalidateQueries([queryKeys.categoriesBudget]);
      opts.onSuccess && opts.onSuccess(resp);
    },
  });
};

export const useDeleteBudget = (opts = {}) => {
  const queryClient = useQueryClient();

  return useMutation(deleteBudget, {
    onSuccess: resp => {
      queryClient.invalidateQueries([queryKeys.categoriesBudget]);
      opts.onSuccess && opts.onSuccess(resp);
    },
  });
};
