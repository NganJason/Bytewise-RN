import { useQuery } from '@tanstack/react-query';
import { getCategories } from '../apis/category';
import { queryKeys } from './keys';

export const useGetCategories = ({ category_type = 0 } = {}, opts = {}) => {
  return useQuery({
    queryFn: () => getCategories({ category_type: category_type }),
    queryKey: [queryKeys.getCategories, ...(opts.queryOnChange || [])],
    onSuccess: opts.onSuccess || function () {},
  });
};
