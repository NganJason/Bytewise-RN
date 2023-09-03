import {
  getCategories,
  getCategory,
  sumCategoryTransactions,
} from '../apis/category';
import { queryKeys, useQueryWrapper } from './keys';

export const useGetCategories = ({ category_type } = {}, opts = {}) => {
  return useQueryWrapper({
    queryFn: () => getCategories({ category_type: category_type }),
    queryKey: [queryKeys.categories, category_type],
    onSuccess: opts.onSuccess || function () {},
    enabled: opts.enabled,
  });
};

export const useGetCategory = ({ category_id = '' } = {}, opts = {}) => {
  return useQueryWrapper({
    queryFn: () => getCategory({ category_id: category_id }),
    queryKey: [queryKeys.category, category_id],
    onSuccess: opts.onSuccess || function () {},
    enabled: opts.enabled,
  });
};

export const useSumCategoryTransactions = (
  { transaction_time: { gte = 0, lte = 0 } = {}, transaction_type = 0 } = {},
  opts = {},
) => {
  return useQueryWrapper({
    queryFn: () =>
      sumCategoryTransactions({
        transaction_time: { gte, lte },
        transaction_type: transaction_type,
      }),
    queryKey: [
      queryKeys.categoryTransactions,
      {
        transaction_time: { gte, lte },
      },
    ],
    onSuccess: opts.onSuccess || function () {},
    enabled: opts.enabled,
  });
};
