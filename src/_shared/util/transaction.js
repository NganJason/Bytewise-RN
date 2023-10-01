import {
  ACCOUNT_TYPE_BANK_ACCOUNT,
  TRANSACTION_TYPE_EXPENSE,
} from '../apis/enum';
import { getFormattedDateString, parseDateStringWithoutDelim } from './date';

export const groupTransactionsByDateStr = (transactions = []) => {
  const dateStrToTransactions = {};
  const { dateToTransactions } = groupTransactionsByDate(transactions);

  for (let ts in dateToTransactions) {
    let txns = dateToTransactions[ts];
    let dateStr = getFormattedDateString(new Date(Number(ts)));
    let totalExpense = 0;
    let totalIncome = 0;

    txns.map(d => {
      if (d.transaction_type === TRANSACTION_TYPE_EXPENSE) {
        totalExpense += Number(d.amount);
      } else {
        totalIncome += Number(d.amount);
      }
    });

    dateStrToTransactions[dateStr] = {
      transactions: dateToTransactions[ts],
      totalExpense: totalExpense,
      totalIncome: totalIncome,
    };
  }

  return dateStrToTransactions;
};

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

export const groupDatesByMonth = (dates = []) => {
  const monthToDates = {};
  const months = [];

  dates.forEach(d => {
    const date = parseDateStringWithoutDelim(d);
    date.setDate(1);
    let ts = date.setHours(0, 0, 0, 0);

    if (!(ts in monthToDates)) {
      months.push(ts);
    }
    monthToDates[ts] = [...(monthToDates[ts] || []), d];
  });
  months.sort().reverse();
  return { months, monthToDates };
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
