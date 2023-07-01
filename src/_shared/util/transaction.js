import {
  ACCOUNT_TYPE_BANK_ACCOUNT,
  TRANSACTION_TYPE_EXPENSE,
} from '../apis/enum';

export const groupTransactionsByDate = (transactions = []) => {
  const transactionGroups = {};
  const transactionTimes = [];

  transactions.forEach(t => {
    // group by date
    const tt = new Date(t.transaction_time).setHours(0, 0, 0, 0);
    if (!(tt in transactionGroups)) {
      transactionTimes.push(tt);
    }
    transactionGroups[tt] = [...(transactionGroups[tt] || []), t];
  });
  transactionTimes.sort().reverse();

  return { transactionTimes, transactionGroups };
};

export const mergeTransactionsCategory = (
  transactions = [],
  categoryMap = {},
) => {
  transactions.map(d => {
    mergeTransactionCategory(d, categoryMap);
  });

  return transactions;
};

export const mergeTransactionCategory = (
  transaction = {},
  categoryMap = {},
) => {
  const category = categoryMap[transaction.category_id] || {
    category_id: '',
    category_name: '',
    category_type: TRANSACTION_TYPE_EXPENSE,
  };
  transaction.category = category;
  return transaction;
};

export const mergeTransactionsAccount = (
  transactions = [],
  accountMap = {},
) => {
  transactions.map(d => {
    mergeTransactionAccount(d, accountMap);
  });

  return transactions;
};

export const mergeTransactionAccount = (transaction = {}, accountMap = {}) => {
  const account = accountMap[transaction.account_id] || {
    account_id: '',
    account_name: '',
    account_type: ACCOUNT_TYPE_BANK_ACCOUNT,
  };
  transaction.account = account;
  return transaction;
};
