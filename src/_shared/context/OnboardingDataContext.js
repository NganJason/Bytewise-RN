import { createContext, useEffect, useState } from 'react';
import { BUDGET_TYPE_MONTHLY, TRANSACTION_TYPE_EXPENSE } from '../apis/enum';

const DefaultCategoryBudgets = [
  {
    category_name: 'Food',
    category_type: TRANSACTION_TYPE_EXPENSE,
    budget: null,
  },
  {
    category_name: 'Rental',
    category_type: TRANSACTION_TYPE_EXPENSE,
    budget: null,
  },
  {
    category_name: 'Entertainment',
    category_type: TRANSACTION_TYPE_EXPENSE,
    budget: null,
  },
  {
    category_name: 'Groceries',
    category_type: TRANSACTION_TYPE_EXPENSE,
    budget: null,
  },
  {
    category_name: 'Travel',
    category_type: TRANSACTION_TYPE_EXPENSE,
    budget: null,
  },
];

const defaultData = {
  categoryBudgets: DefaultCategoryBudgets,
};

const OnboardingDataContext = createContext();
const OnboardingDataProvider = ({ children }) => {
  const [meta, setMeta] = useState({
    budgetTypeDescShowed: false,
  });
  const [data, setData] = useState(defaultData);
  const [committedData, setCommittedData] = useState(
    JSON.stringify(defaultData),
  );

  const commitData = () => {
    setCommittedData(JSON.stringify(data));
  };

  const rollbackData = () => {
    setData(JSON.parse(committedData));
  };

  const shouldShowBudgetTypeDesc = () => {
    return !meta.budgetTypeDescShowed;
  };

  const markBudgetTypeDesc = () => {
    return (meta.budgetTypeDescShowed = true);
  };

  const addCategory = e => {
    const { categoryBudgets = [] } = data;
    const newCategoryBudgets = [...categoryBudgets, e];
    setData({ ...data, categoryBudgets: newCategoryBudgets });
  };

  const deleteCategory = idx => {
    const { categoryBudgets = [] } = data;
    const newCategoryBudgets = categoryBudgets.filter(
      (_, index) => index !== idx,
    );
    setData({ ...data, categoryBudgets: newCategoryBudgets });
  };

  const addBudget = (
    idx = 0,
    budget = { amount: 0, budget_type: BUDGET_TYPE_MONTHLY },
  ) => {
    const { categoryBudgets = [] } = data;
    const newCategoryBudgets = [...categoryBudgets];
    newCategoryBudgets[idx].budget = budget;
    setData({ ...data, categoryBudgets: newCategoryBudgets });
  };

  return (
    <OnboardingDataContext.Provider
      value={{
        data,
        setData,
        committedData,
        setCommittedData,
        commitData,
        rollbackData,
        shouldShowBudgetTypeDesc,
        markBudgetTypeDesc,
        addCategory,
        deleteCategory,
        addBudget,
      }}>
      {children}
    </OnboardingDataContext.Provider>
  );
};

export { OnboardingDataProvider, OnboardingDataContext };
