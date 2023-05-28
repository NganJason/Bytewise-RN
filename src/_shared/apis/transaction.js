import { AppError, sendPostRequest } from './http';

export class TransactionError extends AppError {
  constructor({ requestID = '', message = '', code = 0 } = {}) {
    super({ requestID, message, code });
  }
}

export const validateTransaction = ({
  category_id = 0,
  amount = '',
  transaction_type = 0,
  transaction_time = 0,
} = {}) => {
  if (category_id === 0) {
    throw new TransactionError({ message: 'Category ID cannot be 0' });
  }
  if (amount === '') {
    throw new TransactionError({ message: 'Amount cannot be empty' });
  }
  if (transaction_type === 0) {
    throw new TransactionError({ message: 'Transaction type cannot be 0' });
  }
  if (transaction_time === 0) {
    throw new TransactionError({ message: 'Transaction time cannot be empty' });
  }
};

const CREATE_TRANSACTION = '/create_transaction';
const GET_TRANSACTIONS = '/get_transactions';
const UPDATE_TRANSACTION = '/update_transaction';
const GET_TRANSACTION = '/get_transaction';

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
  category_id = '',
  transaction_type = 0,
  transaction_time: { gte = 0, lte = 0 } = {},
  paging: { limit = 500, page = 1 } = {},
} = {}) => {
  try {
    const body = await sendPostRequest(GET_TRANSACTIONS, {
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
  amount = '',
  transaction_type = 0,
  transaction_time = 0,
  note = '',
} = {}) => {
  try {
    const body = await sendPostRequest(CREATE_TRANSACTION, {
      category_id: category_id,
      amount: amount,
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
  amount = '',
  transaction_type = 0,
  transaction_time = 0,
  note = '',
} = {}) => {
  try {
    const body = await sendPostRequest(UPDATE_TRANSACTION, {
      transaction_id: transaction_id,
      category_id: category_id,
      amount: amount,
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
