import { BUDGET_TYPES, BUDGET_TYPE_MONTHLY } from '../apis/enum';
import { MONTHS } from '../constant/constant';
import { getMonth, getYear } from './date';

export const getBudgetTypes = () => {
  let budgetTypes = [];
  for (const budget_enum in BUDGET_TYPES) {
    budgetTypes.push({
      name: BUDGET_TYPES[budget_enum],
      value: Number(budget_enum),
    });
  }

  return budgetTypes;
};

export const getDefaultMonthlyBudgetBreakdown = (initialMonthlyBudget = []) => {
  if (initialMonthlyBudget.length > 0) {
    return initialMonthlyBudget;
  }

  let defaultBudgets = [];
  Object.keys(MONTHS).forEach(m => {
    defaultBudgets.push({
      month: Number(m),
      budget: 0,
    });
  });

  return defaultBudgets;
};

export const getBudgetAmountFromBreakdown = (
  activeDate = new Date(),
  breakdowns = [],
  budgetType = BUDGET_TYPE_MONTHLY,
) => {
  let amount = 0;
  let year = getYear(activeDate);
  let month = getMonth(activeDate);

  breakdowns.map(val => {
    if (budgetType === BUDGET_TYPE_MONTHLY) {
      if (val.year === year && val.month === month) {
        amount = val.amount;
      }
    } else {
      if (val.year === year) {
        amount = val.amount;
      }
    }
  });

  return amount;
};
