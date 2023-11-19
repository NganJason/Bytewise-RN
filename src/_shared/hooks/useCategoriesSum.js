import {
  TRANSACTION_TYPE_EXPENSE,
  TRANSACTION_TYPE_INCOME,
} from '../apis/enum';
import { Amount } from '../object';
import { useSumCategoryTransactions } from '../query';

const useCategoriesSum = timeRange => {
  const expenseSum = useSumCategoryTransactions({
    transaction_time: {
      gte: timeRange[0],
      lte: timeRange[1],
    },
    transaction_type: TRANSACTION_TYPE_EXPENSE,
  });

  const incomeSum = useSumCategoryTransactions({
    transaction_time: {
      gte: timeRange[0],
      lte: timeRange[1],
    },
    transaction_type: TRANSACTION_TYPE_INCOME,
  });

  const getSortedExpenseCategoriesSum = () => {
    const { sums = [] } = expenseSum?.data || {};
    return processCategoriesData(sums);
  };

  const getSortedIncomeCategoriesSum = () => {
    const { sums = [] } = incomeSum?.data || {};
    return processCategoriesData(sums);
  };

  const processCategoriesData = (sums = []) => {
    let categories = [];
    let uncategorisedCategory = null;

    sums.map(d => {
      if (d.category) {
        categories.push({
          category_id: d.category.category_id,
          category_name: d.category.category_name,
          sum: new Amount(Math.abs(d.sum).toFixed(2), d.currency),
          currency: d.category.currency,
        });
      } else {
        uncategorisedCategory = {
          category_name: 'Uncategorised',
          sum: new Amount(Math.abs(d.sum).toFixed(2), d.currency),
          currency: d.currency,
        };
      }
    });

    if (uncategorisedCategory) {
      categories.push(uncategorisedCategory);
    }
    categories.sort((a, b) => b.sum.amount - a.sum.amount);
    return categories;
  };

  const getErrors = () => {
    return [expenseSum, incomeSum];
  };

  return {
    getSortedExpenseCategoriesSum,
    getSortedIncomeCategoriesSum,
    getErrors,
    isLoading: expenseSum.isLoading || incomeSum.isLoading,
  };
};

export default useCategoriesSum;
