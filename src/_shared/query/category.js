import { getCategories, getCategory } from '../apis/category';
import { queryKeys, useQueryWrapper } from './keys';

export const useGetCategories = ({ category_type = 0 } = {}, opts = {}) => {
  return useQueryWrapper({
    staleTime: Infinity,
    queryFn: () => getCategories({ category_type: category_type }),
    queryKey: [queryKeys.categories, category_type],
    onSuccess: opts.onSuccess || function () {},
    enabled: opts.enabled,
  });
};

export const useGetCategory = ({ category_id = '' } = {}, opts = {}) => {
  return useQueryWrapper({
    staleTime: Infinity,
    queryFn: () => getCategory({ category_id: category_id }),
    queryKey: [queryKeys.category, category_id],
    onSuccess: opts.onSuccess || function () {},
    enabled: opts.enabled,
  });
};
