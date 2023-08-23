import { createContext, useState } from 'react';
import {
  ACCOUNT_TYPE_INVESTMENT,
  BUDGET_REPEAT_ALL_TIME,
  BUDGET_TYPE_MONTHLY,
  TRANSACTION_TYPE_EXPENSE,
} from '../apis/enum';
import { useCreateAccounts } from '../mutations/account';
import { useCreateBudgets } from '../mutations/budget';
import { useCreateCategories } from '../mutations/category';
import { getDateStringWithoutDelim } from '../util';

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
  accounts: [],
  investmentAccount: {
    account_name: '',
    holdings: [],
  },
};

const OnboardingDataContext = createContext();
const OnboardingDataProvider = ({ children }) => {
  // ---------------- Meta ----------------
  const [meta, setMeta] = useState({
    budgetTypeDescShowed: false,
  });

  const shouldShowBudgetTypeDesc = () => {
    return !meta.budgetTypeDescShowed;
  };

  const markBudgetTypeDesc = () => {
    setMeta({ ...meta, budgetTypeDescShowed: true });
  };

  // ---------------- Data ----------------
  const [data, setData] = useState(defaultData);

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
    newCategoryBudgets[idx].budget = {
      ...budget,
      budget_date: getDateStringWithoutDelim(),
      category_id: newCategoryBudgets[idx]?.category_id || '',
      budget_repeat: BUDGET_REPEAT_ALL_TIME,
    };
    setData({ ...data, categoryBudgets: newCategoryBudgets });
  };

  const addAccount = e => {
    const { accounts = [] } = data;
    const newAccounts = [...accounts, e];
    setData({ ...data, accounts: newAccounts });
  };

  const updateAccount = (idx = 0, account = {}) => {
    const { accounts = [] } = data;
    const newAccounts = [...accounts];
    newAccounts[idx] = account;
    setData({ ...data, accounts: newAccounts });
  };

  const addInvestmentAccountName = (name = '') => {
    setData({
      ...data,
      investmentAccount: { ...data.investmentAccount, account_name: name },
    });
  };

  const addInvestmentHolding = (holding = {}) => {
    const { holdings = [] } = data?.investmentAccount || {};
    const newHoldings = [...holdings];
    newHoldings.push(holding);
    setData({
      ...data,
      investmentAccount: { ...data.investmentAccount, holdings: newHoldings },
    });
  };

  // ---------------- Commit data ----------------
  const createCategories = useCreateCategories();
  const createBudgets = useCreateBudgets();
  const createAccounts = useCreateAccounts();

  const commitCategories = (onSuccess = function () {}) => {
    createCategories.mutate(
      { categories: data.categoryBudgets },
      {
        onSuccess: resp => {
          const { categories = [] } = resp || {};
          let newCategories = categories.map(category => {
            return { ...category, budget: null };
          });
          setData({ ...data, categoryBudgets: newCategories });

          onSuccess();
        },
      },
    );
  };

  const commitBudgets = onSuccess => {
    let budgets = [];
    data.categoryBudgets.map(cb => {
      if (cb.budget !== null) {
        budgets.push(cb?.budget);
      }
    });

    if (budgets.length > 0) {
      createBudgets.mutate({ budgets: budgets }, { onSuccess: onSuccess });
    } else {
      onSuccess();
    }
  };

  const commitAccounts = onSuccess => {
    let { accounts = [] } = data;
    if (accounts.length > 0) {
      createAccounts.mutate({ accounts: accounts }, { onSuccess: onSuccess });
    } else {
      onSuccess();
    }
  };

  const commitInvestment = onSuccess => {
    let { investmentAccount = { account_name: '', holdings: [] } } = data;

    if (investmentAccount.account_name !== '') {
      let investmentAccountReq = {
        account_name: investmentAccount.account_name,
        account_type: ACCOUNT_TYPE_INVESTMENT,
        holdings: investmentAccount.holdings,
      };

      createAccounts.mutate(
        { accounts: [investmentAccountReq] },
        { onSuccess: onSuccess },
      );
    } else {
      onSuccess();
    }
  };

  return (
    <OnboardingDataContext.Provider
      value={{
        data,
        setData,
        shouldShowBudgetTypeDesc,
        markBudgetTypeDesc,
        addCategory,
        deleteCategory,
        addBudget,
        addAccount,
        updateAccount,
        addInvestmentAccountName,
        addInvestmentHolding,
        commitCategories,
        commitBudgets,
        commitAccounts,
        commitInvestment,
      }}>
      {children}
    </OnboardingDataContext.Provider>
  );
};

export { OnboardingDataProvider, OnboardingDataContext };
