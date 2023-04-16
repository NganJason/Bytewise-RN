import { useMutation } from '@tanstack/react-query';
import { createCateory } from '../dao/category';

export const useCreateCategory = (opts = {}) => {
  const createCategory = async category => {
    await createCateory(category);
  };

  return useMutation({ mutationFn: createCategory, ...opts });
};
