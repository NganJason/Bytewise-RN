import { createContext, useState } from 'react';
import {
  ACCOUNT_TYPE_INVESTMENT,
  BUDGET_TYPE_MONTHLY,
  HOLDING_TYPE_DEFAULT,
  TRANSACTION_TYPE_EXPENSE,
} from '../apis/enum';
import { useInitUser } from '../mutations/user';

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
    account_type: ACCOUNT_TYPE_INVESTMENT,
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
  const [committedData, setCommittedData] = useState(
    JSON.stringify(defaultData),
  );

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
    newCb[idx].budget = budget;
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
  const initUser = useInitUser();

  const commitData = () => {
    setCommittedData(JSON.stringify(data));
  };

  const rollbackData = () => {
    setData(JSON.parse(committedData));
  };

  const setupUser = () => {
    // Clone data
    let dataStr = JSON.stringify(data);
    let finalData = JSON.parse(dataStr);

    let { investmentAccount = { account_name: '', holdings: [] } } = finalData;

    if (investmentAccount.account_name !== '') {
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

      finalData.accounts = [...finalData.accounts, investmentAccountReq];
    }

    initUser.mutate({
      accounts: finalData.accounts,
      categories: finalData.categoryBudgets,
    });
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

        commitData,
        rollbackData,
        setupUser,
        isSetupLoading: initUser.isLoading,
      }}>
      {children}
    </OnboardingDataContext.Provider>
  );
};

export { OnboardingDataProvider, OnboardingDataContext };
