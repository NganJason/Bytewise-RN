import { useEffect, useState } from 'react';
import {
  useGetAccounts,
  useGetCategories,
  useGetTransaction,
  useGetTransactions,
} from '../query';
import {
  getIDToAccountMap,
  getIDToCategoryMap,
  mergeTransactionAccount,
  mergeTransactionCategory,
  mergeTransactionsAccount,
  mergeTransactionsCategory,
} from '../util';

export const useGetTransactionsHook = (
  {
    account_id = '',
    category_id = '',
    transaction_type = 0,
    transaction_time: { gte = 0, lte = 0 } = {},
    paging: { limit = 500, page = 1 } = {},
  } = {},
  opts = {},
) => {
  const [transactions, setTransactions] = useState([]);
  const getCategories = useGetCategories();
  const getAccounts = useGetAccounts();
  const getTransactions = useGetTransactions(
    {
      account_id: account_id,
      category_id: category_id,
      transaction_type: transaction_type,
      transaction_time: {
        gte: gte,
        lte: lte,
      },
      paging: {
        limit: limit,
        page: page,
      },
    },
    opts,
  );

  useEffect(() => {
    const { categories = [] } = getCategories?.data || {};
    const categoryMap = getIDToCategoryMap(categories);

    const { accounts = [] } = getAccounts?.data || {};
    const accountMap = getIDToAccountMap(accounts);

    let { transactions: txns = [] } = getTransactions?.data || {};
    if (txns.length === 0) {
      setTransactions(txns);
      return;
    }

    txns = mergeTransactionsCategory(txns, categoryMap);
    txns = mergeTransactionsAccount(txns, accountMap);
    setTransactions([...txns]);
  }, [getTransactions.data, getCategories.data, getAccounts.data]);

  const isLoading = () => {
    return (
      getCategories.isLoading ||
      getTransactions.isLoading ||
      getAccounts.isLoading
    );
  };

  const isError = () => {
    return (
      getCategories.isError || getTransactions.isError || getAccounts.isError
    );
  };

  const error = () => {
    if (getCategories.isError) {
      return getCategories.error;
    } else if (getAccounts.isError) {
      return getAccounts.error;
    } else {
      return getTransactions.error;
    }
  };

  const reset = () => {};

  return {
    transactions: transactions,
    isLoading: isLoading(),
    isError: isError(),
    error: error(),
    reset: reset,
  };
};

export const useGetTransactionHook = (
  params = { transaction_id: '' },
  opts = {},
) => {
  const [transaction, setTransaction] = useState(undefined);
  const getCategories = useGetCategories();
  const getAccounts = useGetAccounts();
  const getTransaction = useGetTransaction(params, opts);

  useEffect(() => {
    const { categories = [] } = getCategories?.data || {};
    const categoryMap = getIDToCategoryMap(categories);

    const { accounts = [] } = getAccounts?.data || {};
    const accountMap = getIDToAccountMap(accounts);

    let { transaction: txn } = getTransaction?.data || {};
    if (txn === undefined) {
      setTransaction(undefined);
      return;
    }

    txn = mergeTransactionCategory(txn, categoryMap);
    txn = mergeTransactionAccount(txn, accountMap);
    setTransaction(txn);
  }, [getTransaction.data, getCategories.data, getAccounts.data]);

  const isLoading = () => {
    return (
      getCategories.isLoading ||
      getTransaction.isLoading ||
      getAccounts.isLoading
    );
  };

  const isError = () => {
    return (
      getCategories.isError || getTransaction.isError || getAccounts.isError
    );
  };

  const error = () => {
    if (getCategories.isError) {
      return getCategories.error;
    } else if (getAccounts.isError) {
      return getAccounts.error;
    } else {
      return getTransaction.error;
    }
  };

  const reset = () => {
    getCategories.reset();
    getTransaction.reset();
    getAccounts.reset();
  };

  return {
    transaction: transaction,
    isLoading: isLoading(),
    isError: isError(),
    error: error(),
    reset: reset,
  };
};
