import {
  ACCOUNT_TYPE_BANK_ACCOUNT,
  TRANSACTION_TYPE_EXPENSE,
} from '../apis/enum';

export const groupTransactionsByDate = (transactions = []) => {
  const dateToTransactions = {};
  const transactionDates = [];

  transactions.forEach(t => {
    // group by date
    const tt = new Date(t.transaction_time).setHours(0, 0, 0, 0);
    if (!(tt in dateToTransactions)) {
      transactionDates.push(tt);
    }
    dateToTransactions[tt] = [...(dateToTransactions[tt] || []), t];
  });
  transactionDates.sort().reverse();

  return { transactionDates, dateToTransactions };
};

export const groupTransactionDatesByMonth = (transactionDates = []) => {
  const transactionMonthToDates = {};
  const transactionMonths = [];

  transactionDates.forEach(d => {
    const date = new Date(d);
    date.setDate(1);
    let ts = date.setHours(0, 0, 0, 0);

    if (!(ts in transactionMonthToDates)) {
      transactionMonths.push(ts);
    }
    transactionMonthToDates[ts] = [...(transactionMonthToDates[ts] || []), d];
  });
  transactionMonths.sort().reverse();

  return { transactionMonths, transactionMonthToDates };
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
