import { useQuery } from '@tanstack/react-query';
import { getCategories } from '../dao/category';
import { queryKeys } from './keys';

export const useGetCategories = () => {
  return useQuery({
    queryFn: getCategories,
    queryKey: [queryKeys.categories],
  });
};
