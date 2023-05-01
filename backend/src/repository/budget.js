import { budgetCollection } from './1_constant';

export const newBudgetRepo = firestoreInstance => {
  const repo = new BudgetRepo(firestoreInstance);
  return repo;
};

class BudgetRepo {
  constructor(firestoreInstance) {
    this.collection = budgetCollection;
    this.fs = firestoreInstance;
  }
}
