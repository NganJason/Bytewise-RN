import {
  ACCOUNT_TYPE_BANK_ACCOUNT,
  TRANSACTION_TYPE_EXPENSE,
} from '../apis/enum';
import { getFormattedDateString, parseDateStringWithoutDelim } from './date';

export const groupTransactionGroupsByDateStr = (transactionGroups = []) => {
  const dateStrToTransactionGroup = {};
  transactionGroups.map(d => {
    let dateStr = getFormattedDateString(parseDateStringWithoutDelim(d.date));
    dateStrToTransactionGroup[dateStr] = d;
  });
  return dateStrToTransactionGroup;
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
