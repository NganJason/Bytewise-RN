import { useState } from 'react';
import { EmptyContent } from '../../Components';
import {
  TRANSACTION_TYPE_EXPENSE,
  TRANSACTION_TYPE_INCOME,
} from '../apis/enum';
import { EmptyContentConfig } from '../constant/constant';
import ROUTES from '../constant/routes';
import { Amount } from '../object';
import {
  useGetAccounts,
  useGetCategories,
  useGetTransactionGroups,
  useSumTransactions,
} from '../query';
import { getMonth, getUnixRangeOfMonth, getYear } from '../util';

const PAGING_LIMIT = 500;
const STARTING_PAGE = 1;

const useTransactionGroups = ({ activeDate = new Date() }) => {
  const [timeRange, setTimeRange] = useState(
    getUnixRangeOfMonth(getYear(activeDate), getMonth(activeDate)),
  );

  const [selectedFilters, setSelectedFilters] = useState({
    Category: [],
    Account: [],
  });

  const getCategories = useGetCategories({});
  const { categories = [] } = getCategories?.data || {};

  const getAccounts = useGetAccounts({});
  let { accounts = [] } = getAccounts?.data || {};

  const getTransactionGroups = useGetTransactionGroups(
    {
      category_ids:
        (selectedFilters?.Category || []).map(d => d.category_id) || [],
      account_id:
        selectedFilters?.Account?.length || [] > 0
          ? selectedFilters?.Account[0]?.account_id
          : null,
      transaction_time: {
        gte: timeRange[0],
        lte: timeRange[1],
      },
      paging: {
        limit: PAGING_LIMIT,
        page: STARTING_PAGE,
      },
    },
    {},
  );

  const sumTransactionsQuery = useSumTransactions({
    transaction_time: {
      gte: timeRange[0],
      lte: timeRange[1],
    },
  });

  const onFilterChange = e => {
    setSelectedFilters(e);
  };

  const getFilterOptions = () => {
    let categoryOptions = categories.map(d => {
      d.name = d.category_name;
      return d;
    });

    let accountOptions = accounts.map(d => {
      d.name = d.account_name;
      return d;
    });

    return [
      {
        name: 'Category',
        iconName: 'grid',
        iconType: 'feather',
        items: categoryOptions,
        emptyContentWithCallback: onPress => (
          <EmptyContent
            item={EmptyContentConfig.category}
            route={ROUTES.categoryForm}
            onRedirect={onPress}
          />
        ),
      },
      {
        name: 'Account',
        iconName: 'credit-card',
        iconType: 'feather',
        items: accountOptions,
        emptyContentWithCallback: onPress => (
          <EmptyContent
            item={EmptyContentConfig.account}
            route={ROUTES.accountSelection}
            onRedirect={onPress}
          />
        ),
      },
    ];
  };

  const getTotalMonthlyIncome = () => {
    return getMonthlyTransactionsSum(TRANSACTION_TYPE_INCOME);
  };

  const getTotalMonthlyExpense = () => {
    return getMonthlyTransactionsSum(TRANSACTION_TYPE_EXPENSE);
  };

  const getMonthlyTransactionsSum = (transactionType = 0) => {
    const { sums = [] } = sumTransactionsQuery?.data || [];

    for (const sum of sums) {
      if (sum.transaction_type === transactionType) {
        return new Amount(sum.sum, sum.currency);
      }
    }

    return new Amount();
  };

  return {
    setTimeRange,
    transactionGroups: getTransactionGroups?.data?.transaction_groups || [],
    getTotalMonthlyIncome,
    getTotalMonthlyExpense,
    selectedFilters,
    onFilterChange,
    getFilterOptions,
    isLoading:
      getCategories.isLoading ||
      getAccounts.isLoading ||
      getTransactionGroups.isLoading ||
      sumTransactionsQuery.isLoading,
  };
};

export default useTransactionGroups;
