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
