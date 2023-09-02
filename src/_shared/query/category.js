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

export const useSumCategoryTransactions = ({}, opts = {}) => {
  return useQueryWrapper({
    queryFn: () => sumCategoryTransactions({}),
    queryKey: [queryKeys.categoryTransactions],
    onSuccess: opts.onSuccess || function () {},
    enabled: opts.enabled,
  });
};
