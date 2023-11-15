import { useContext, useState } from 'react';
import EmptyContent from '../../Components/Common/EmptyContent';
import {
  TRANSACTION_TYPE_EXPENSE,
  TRANSACTION_TYPE_INCOME,
} from '../apis/enum';
import { EmptyContentConfig } from '../constant/constant';
import ROUTES from '../constant/routes';
import { UserMetaContext } from '../context/UserMetaContext';
import { Amount } from '../object';
import {
  useGetAccounts,
  useGetCategories,
  useGetTransactionGroups,
  useSumTransactions,
} from '../query';
import {
  getMonth,
  getUnixRangeOfMonth,
  getYear,
  groupTransactionGroupsByDateStr,
} from '../util';

const PAGING_LIMIT = 500;
const STARTING_PAGE = 1;

const useTransactionGroups = (
  activeDate = new Date(),
  accountID = '',
  categoryIDs = [],
) => {
  const { getUserBaseCurrency } = useContext(UserMetaContext);

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

  const getFilteredCategoryIDs = () => {
    let catIDs = categoryIDs;
    (selectedFilters?.Category || []).map(d => {
      catIDs.push(d.category_id);
    });
    return catIDs;
  };

  const getFilteredAccountID = () => {
    if (accountID !== '') {
      return accountID;
    }
    if (selectedFilters?.Account?.length || [] > 0) {
      return selectedFilters?.Account[0]?.account_id;
    }
    return null;
  };

  const getTransactionGroups = useGetTransactionGroups(
    {
      category_ids: getFilteredCategoryIDs(),
      account_id: getFilteredAccountID(),
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
  const { transaction_groups: transactionGroups } =
    getTransactionGroups?.data || [];

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
      // {
      //   name: 'Account',
      //   iconName: 'credit-card',
      //   iconType: 'feather',
      //   items: accountOptions,
      //   emptyContentWithCallback: onPress => (
      //     <EmptyContent
      //       item={EmptyContentConfig.account}
      //       route={ROUTES.accountSelection}
      //       onRedirect={onPress}
      //     />
      //   ),
      // },
    ];
  };

  const getMonthlyTotalIncome = () => {
    return getMonthlyTransactionsSum(TRANSACTION_TYPE_INCOME);
  };

  const getMonthlyTotalExpense = (absNum = false) => {
    let expense = getMonthlyTransactionsSum(TRANSACTION_TYPE_EXPENSE);
    if (absNum) {
      return new Amount(Math.abs(expense.amount), expense.currency);
    }
    return expense;
  };

  const getMonthlyTotalSavings = () => {
    let expense = getMonthlyTotalExpense();
    let income = getMonthlyTotalIncome();

    return new Amount(income.amount + expense.amount, expense.currency);
  };

  const getMonthlyTransactionsSum = (transactionType = 0) => {
    let dateStrToTransactionGroup =
      groupTransactionGroupsByDateStr(transactionGroups);

    let sum = 0;
    let currency = getUserBaseCurrency();
    for (let dateStr of Object.keys(dateStrToTransactionGroup)) {
      let group = dateStrToTransactionGroup[dateStr];
      if (transactionType === TRANSACTION_TYPE_EXPENSE) {
        sum += Number(group?.total_expense || 0);
      } else {
        sum += Number(group?.total_income || 0);
      }
      currency = group?.currency || getUserBaseCurrency();
    }
    return new Amount(sum, currency);
  };

  const getDailyTotalExpenseIncome = dateStr => {
    let dateStrToTransactionGroup =
      groupTransactionGroupsByDateStr(transactionGroups);

    const expense = Number(
      dateStrToTransactionGroup[dateStr]?.total_expense || 0,
    );
    const income = Number(
      dateStrToTransactionGroup[dateStr]?.total_income || 0,
    );
    return [expense, income];
  };

  const getTransactionGroupByDateStr = dateStr => {
    let dateStrToTransactionGroup =
      groupTransactionGroupsByDateStr(transactionGroups);
    return dateStrToTransactionGroup[dateStr] || null;
  };

  const getErrors = () => {
    return [
      getCategories,
      getAccounts,
      getTransactionGroups,
      sumTransactionsQuery,
    ];
  };

  return {
    timeRange,
    setTimeRange,
    transactionGroups: transactionGroups,
    getMonthlyTotalIncome,
    getMonthlyTotalExpense,
    getMonthlyTotalSavings,
    getDailyTotalExpenseIncome,
    getTransactionGroupByDateStr,
    selectedFilters,
    onFilterChange,
    getFilterOptions,
    isLoading:
      getCategories.isLoading ||
      getAccounts.isLoading ||
      getTransactionGroups.isLoading ||
      sumTransactionsQuery.isLoading,
    getErrors,
  };
};

export default useTransactionGroups;
