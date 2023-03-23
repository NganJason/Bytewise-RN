import { useQuery } from 'react-query';
import { getGlobalDao } from '../api/api';

export const PocketeerQueryKey = {
  GET_BUDGET_OVERVIEW: 'GET_BUDGET_OVERVIEW',
};

export const useGetBudgetOverviewQuery = options => {
  const fetchBudgetOverview = async () => {
    let resp = await getGlobalDao().getBudgetOverview();

    return resp;
  };

  return useQuery(
    PocketeerQueryKey.GET_BUDGET_OVERVIEW,
    fetchBudgetOverview,
    options,
  );
};
