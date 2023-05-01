var globalRegistry;

export const initGlobalRegistry = () => {
  if (globalRegistry === undefined) {
    globalRegistry = new Registry();
  }
  return globalRegistry;
};

class Registry {
  constructor() {
    this.UserRepo = null;
    this.CategoryRepo = null;
    this.BudgetRepo = null;
    this.TransactionRepo = null;
  }

  setUserRepo(userRepo) {
    this.UserRepo = userRepo;
    return this;
  }

  setCategoryRepo(categoryRepo) {
    this.CategoryRepo = categoryRepo;
    return this;
  }

  setBudgetRepo(budgetRepo) {
    this.BudgetRepo = budgetRepo;
    return this;
  }

  setTransactionRepo(transactionRepo) {
    this.TransactionRepo = transactionRepo;
    return this;
  }
}

export const getGlobalRegistry = () => {
  return globalRegistry;
};

export const getUserRepo = () => {
  return globalRegistry.UserRepo;
};

export const getCategoryRepo = () => {
  return globalRegistry.CategoryRepo;
};

export const getBudgetRepo = () => {
  return globalRegistry.BudgetRepo;
};

export const getTransactionRepo = () => {
  return globalRegistry.TransactionRepo;
};
