import { createContext, useEffect, useState } from 'react';
import {
  ACCOUNT_TYPE_INVESTMENT,
  BUDGET_TYPE_MONTHLY,
  HOLDING_TYPE_DEFAULT,
  TRANSACTION_TYPE_EXPENSE,
} from '../apis/enum';
import { useCreateAccounts } from '../mutations/account';
import { useCreateBudgets } from '../mutations/budget';
import { useCreateCategories } from '../mutations/category';

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
    budgetTypeDescShown: false,
  });

  const isBudgetTypeDescShown = () => {
    return meta.budgetTypeDescShown;
  };

  const markBudgetTypeDesc = () => {
    setMeta({ ...meta, budgetTypeDescShown: true });
  };

  // ---------------- Data ----------------
  const [data, setData] = useState(defaultData);

  const addCategory = e => {
    const newCb = [...(data.categoryBudgets || []), e];
    setData({ ...data, categoryBudgets: newCb });
  };

  const deleteCategory = idx => {
    const { categoryBudgets = [] } = data;
    const newCb = categoryBudgets.filter((_, index) => index !== idx);
    setData({ ...data, categoryBudgets: newCb });
  };

  const addBudget = (
    idx = 0,
    budget = { amount: 0, budget_type: BUDGET_TYPE_MONTHLY },
  ) => {
    const newCb = [...(data.categoryBudgets || [])];
    newCb[idx].budget = {
      ...budget,
      category_id: newCb[idx]?.category_id || '',
    };
    setData({ ...data, categoryBudgets: newCb });
  };

  const addAccount = e => {
    const newAccounts = [...(data.accounts || []), e];
    setData({ ...data, accounts: newAccounts });
  };

  const updateAccount = (idx = 0, account = {}) => {
    const newAccounts = [...(data.accounts || [])];
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
    const newHoldings = [...(data?.investmentAccount?.holdings || [])];
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

  const [isCommitLoading, setIsCommitLoading] = useState(false);
  useEffect(() => {
    setIsCommitLoading(
      createCategories.isLoading ||
        createBudgets.isLoading ||
        createAccounts.isLoading,
    );
  }, [
    createCategories.isLoading,
    createBudgets.isLoading,
    createAccounts.isLoading,
  ]);

  const commitCategories = (onSuccess = function () {}) => {
    createCategories.mutate(
      { categories: data.categoryBudgets },
      {
        onSuccess: ({ categories = [] }) => {
          let newCb = categories.map(category => {
            return { ...category, budget: null };
          });
          setData({ ...data, categoryBudgets: newCb });
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

    if (investmentAccount.account_name === '') {
      onSuccess();
      return;
    }

    let symbolToHoldingsMap = {};
    investmentAccount.holdings.map(holding => {
      if (!(holding.symbol in symbolToHoldingsMap)) {
        symbolToHoldingsMap[holding.symbol] = [];
      }
      symbolToHoldingsMap[holding.symbol].push(holding);
    });

    let holdingsReq = [];
    for (const symbol in symbolToHoldingsMap) {
      let holdings = symbolToHoldingsMap[symbol];
      let lots = [];

      holdings.map(holding => {
        lots.push({
          shares: holding.shares,
          cost_per_share: holding.cost_per_share,
          trade_date: holding.trade_date,
        });
      });

      holdingsReq.push({
        symbol: symbol,
        holding_type: holdings[0]?.holding_type || HOLDING_TYPE_DEFAULT,
        lots: lots,
      });
    }

    let investmentAccountReq = {
      account_name: investmentAccount.account_name,
      account_type: ACCOUNT_TYPE_INVESTMENT,
      holdings: holdingsReq,
    };

    createAccounts.mutate(
      { accounts: [investmentAccountReq] },
      { onSuccess: onSuccess },
    );
  };

  const getWithErrors = () => {
    return [createCategories, createBudgets, createAccounts];
  };

  return (
    <OnboardingDataContext.Provider
      value={{
        data,
        setData,
        isBudgetTypeDescShown,
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
        getWithErrors,
        isCommitLoading,
      }}>
      {children}
    </OnboardingDataContext.Provider>
  );
};

export { OnboardingDataProvider, OnboardingDataContext };
