import { BUDGET_TYPES } from '../api/data/model';
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

export const getDefaultMonthlyBudgetBreakdown = (cachedBreakdown = []) => {
  if (cachedBreakdown.length > 0) {
    return cachedBreakdown;
  }

  let defaultBudgets = [];
  Object.keys(MONTHS).forEach(m => {
    defaultBudgets.push({
      month: m,
      budget: 0,
    });
  });

  return defaultBudgets;
};
