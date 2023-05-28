import { useQuery } from '@tanstack/react-query';
import { getCategories, getCategory } from '../apis/category';
import { queryKeys } from './keys';

export const useGetCategories = ({ category_type = 0 } = {}, opts = {}) => {
  return useQuery({
    queryFn: () => getCategories({ category_type: category_type }),
    queryKey: [queryKeys.categories, category_type],
    onSuccess: opts.onSuccess || function () {},
  });
};

export const useGetCategory = ({ category_id = '' } = {}, opts = {}) => {
  return useQuery({
    queryFn: () => getCategory({ category_id: category_id }),
    queryKey: [queryKeys.category, category_id],
    onSuccess: opts.onSuccess || function () {},
    enabled: opts.enabled,
  });
};
