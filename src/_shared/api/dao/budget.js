import { getFs } from '../storage/firestore';

var budgetDao;

export const initBudgetDao = () => {
  if (budgetDao !== undefined) {
    return;
  }

  budgetDao = new BudgetDao();
};

export const getBudgetDao = () => {
  if (budgetDao === undefined) {
    initBudgetDao();
  }

  return budgetDao;
};

class BudgetDao {
  constructor() {
    this.db = getFs();
  }
}
