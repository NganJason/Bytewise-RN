import { useQuery } from '@tanstack/react-query';
import { getCategoriesApi } from '../apis/category';
import { queryKeys } from './keys';

export const useGetCategories = () => {
  return useQuery({
    queryFn: getCategoriesApi,
    queryKey: [queryKeys.getCategories],
  });
};
