import { BUDGET_TYPES } from '../apis/enum';
import { MONTHS } from '../constant/constant';

export const getBudgetTypes = () => {
  let budgetTypes = [];
  for (const budget_enum in BUDGET_TYPES) {
    budgetTypes.push({
      name: BUDGET_TYPES[budget_enum],
      value: budget_enum,
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
