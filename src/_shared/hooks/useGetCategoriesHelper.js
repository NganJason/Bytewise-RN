import { useEffect, useState } from 'react';
import { useGetCategories } from '../query/category';
import { useGetCategoriesBudget } from '../query/budget';
import * as Localization from 'expo-localization';
import { getDateStringWithoutDelim } from '../util/date';

const useGetCategoriesHelper = ({ budgetDate = new Date() } = {}) => {
  const [categoryIDs, setCategoryIDs] = useState([]);
  const [categoriesWithBudget, setCategoriesWithBudget] = useState([]);
  const [categoriesWithoutBudget, setCategoriesWithoutBudget] = useState([]);
  const [categoryIDToCategoryMap, setCategoryIDToCategoryMap] = useState({});

  const getCategories = useGetCategories({});
  useEffect(() => {
    const { categories = [] } = getCategories.data || {};
    let ids = [];

    categories.map(category => {
      ids.push(category.category_id);
    });
    setCategoryIDs(ids);
  }, [getCategories.data, budgetDate]);

  const getCategoriesBudget = useGetCategoriesBudget(
    {
      category_ids: categoryIDs,
      budget_date: getDateStringWithoutDelim(budgetDate),
      timezone: Localization.timezone,
    },
    {
      enabled: categoryIDs.length > 0,
    },
  );
  useEffect(() => {
    let withBudget = [];
    let withoutBudget = [];
    let newMap = {};

    const { categories = [] } = getCategoriesBudget?.data || {};
    categories.map(category => {
      newMap[category.category_id] = category;

      if (category.budget) {
        withBudget.push(category);
      } else {
        withoutBudget.push(category);
      }
    });

    setCategoryIDToCategoryMap(newMap);
    setCategoriesWithBudget(withBudget);
    setCategoriesWithoutBudget(withoutBudget);
  }, [getCategoriesBudget.data]);

  const isLoading = () => {
    return getCategories.isLoading || getCategoriesBudget.isLoading;
  };

  const getQueries = () => {
    return [getCategories, getCategoriesBudget];
  };

  return {
    categoriesWithBudget,
    categoriesWithoutBudget,
    isLoading,
    getQueries,
    categoryIDToCategoryMap,
  };
};

export default useGetCategoriesHelper;
