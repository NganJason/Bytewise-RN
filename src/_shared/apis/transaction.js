import { AppError, sendPostRequest } from './http';

export class TransactionError extends AppError {
  constructor({ requestID = '', message = '', code = 0 } = {}) {
    super({ requestID, message, code });
  }
}

const SUM_TRANSACTIONS = '/sum_transactions';
const CREATE_TRANSACTION = '/create_transaction';
const GET_TRANSACTIONS = '/get_transactions';
const UPDATE_TRANSACTION = '/update_transaction';
const GET_TRANSACTION = '/get_transaction';
const DELETE_TRANSACTION = '/delete_transaction';
const GET_TRANSACTION_GROUPS = '/get_transaction_groups';
const GET_TRANSACTIONS_SUMMARY = '/get_transactions_summary';

export const getTransactionsSummary = async ({
  unit = 0,
  interval = 0,
} = {}) => {
  try {
    const body = await sendPostRequest(GET_TRANSACTIONS_SUMMARY, {
      unit: unit,
      interval: interval,
    });
    return body;
  } catch (e) {
    throw new TransactionError({
      requestID: e.requestID,
      message: e.message,
      code: e.code,
    });
  }
};

export const sumTransactions = async ({
  transaction_type = null,
  transaction_time: { gte = 0, lte = 0 } = {},
} = {}) => {
  try {
    const body = await sendPostRequest(SUM_TRANSACTIONS, {
      transaction_type: transaction_type,
      transaction_time: { gte, lte },
    });
    return body;
  } catch (e) {
    throw new TransactionError({
      requestID: e.requestID,
      message: e.message,
      code: e.code,
    });
  }
};

export const getTransaction = async ({ transaction_id = '' } = {}) => {
  try {
    const body = await sendPostRequest(GET_TRANSACTION, {
      transaction_id: transaction_id,
    });
    return body;
  } catch (e) {
    throw new TransactionError({
      requestID: e.requestID,
      message: e.message,
      code: e.code,
    });
  }
};

export const getTransactions = async ({
  account_id = null,
  category_id = null,
  transaction_type = 0,
  transaction_time: { gte = 0, lte = 0 } = {},
  paging: { limit = 500, page = 1 } = {},
} = {}) => {
  try {
    const body = await sendPostRequest(GET_TRANSACTIONS, {
      account_id: account_id,
      category_id: category_id,
      transaction_type: transaction_type,
      transaction_time: { gte, lte },
      paging: {
        limit: limit,
        page: page,
      },
    });
    return body;
  } catch (e) {
    throw new TransactionError({
      requestID: e.requestID,
      message: e.message,
      code: e.code,
    });
  }
};

export const getTransactionGroups = async ({
  account_id = null,
  category_id = null,
  category_ids = null,
  transaction_type = null,
  transaction_time: { gte = 0, lte = 0 } = {},
  paging: { limit = 500, page = 1 } = {},
} = {}) => {
  try {
    const body = await sendPostRequest(GET_TRANSACTION_GROUPS, {
      account_id: account_id,
      category_id: category_id,
      category_ids: category_ids,
      transaction_type: transaction_type,
      transaction_time: { gte, lte },
      paging: {
        limit: limit,
        page: page,
      },
    });
    return body;
  } catch (e) {
    throw new TransactionError({
      requestID: e.requestID,
      message: e.message,
      code: e.code,
    });
  }
};

export const createTransaction = async ({
  category_id = '',
  account_id = '',
  from_account_id = '',
  to_account_id = '',
  amount = '',
  currency = '',
  transaction_type = 0,
  transaction_time = 0,
  note = '',
} = {}) => {
  try {
    const body = await sendPostRequest(CREATE_TRANSACTION, {
      category_id: category_id,
      account_id: account_id,
      from_account_id: from_account_id,
      to_account_id: to_account_id,
      amount: amount,
      currency: currency,
      transaction_type: transaction_type,
      transaction_time: transaction_time,
      note: note,
    });
    return body;
  } catch (e) {
    throw new TransactionError({
      requestID: e.requestID,
      message: e.message,
      code: e.code,
    });
  }
};

export const updateTransaction = async ({
  transaction_id = '',
  category_id = '',
  account_id = '',
  from_account_id: from_account_id,
  to_account_id: to_account_id,
  amount = '',
  currency = '',
  transaction_type = 0,
  transaction_time = 0,
  note = '',
} = {}) => {
  try {
    const body = await sendPostRequest(UPDATE_TRANSACTION, {
      transaction_id: transaction_id,
      category_id: category_id,
      account_id: account_id,
      from_account_id: from_account_id,
      to_account_id: to_account_id,
      amount: amount,
      currency: currency,
      transaction_type: transaction_type,
      transaction_time: transaction_time,
      note: note,
    });
    return body;
  } catch (e) {
    throw new TransactionError({
      requestID: e.requestID,
      message: e.message,
      code: e.code,
    });
  }
};

export const deleteTransaction = async ({ transaction_id = '' } = {}) => {
  try {
    const body = await sendPostRequest(DELETE_TRANSACTION, {
      transaction_id: transaction_id,
    });
    return body;
  } catch (e) {
    throw new TransactionError({
      requestID: e.requestID,
      message: e.message,
      code: e.code,
    });
  }
};
