import { AppError, sendPostRequest } from './http';

export class AccountError extends AppError {
  constructor({ requestID = '', message = '', code = 0 } = {}) {
    super({ requestID, message, code });
  }
}

const GET_ACCOUNTS = '/get_accounts';
const GET_ACCOUNT = '/get_account';
const CREATE_ACCOUNT = '/create_account';
const UPDATE_ACCOUNT = '/update_account';

export const getAccount = async ({ account_id = '' } = {}) => {
  try {
    const body = await sendPostRequest(GET_ACCOUNT, {
      account_id: account_id,
    });
    return body;
  } catch (e) {
    throw new AccountError({
      requestID: e.requestID,
      message: e.message,
      code: e.code,
    });
  }
};

export const getAccounts = async ({ account_type = '' } = {}) => {
  try {
    const body = await sendPostRequest(GET_ACCOUNTS, {
      account_type: account_type,
    });
    return body;
  } catch (e) {
    throw new AccountError({
      requestID: e.requestID,
      message: e.message,
      code: e.code,
    });
  }
};

export const createAccount = async ({
  account_name = '',
  account_type = 0,
  balance = '',
  note = '',
} = {}) => {
  try {
    const body = await sendPostRequest(CREATE_ACCOUNT, {
      account_name: account_name,
      account_type: account_type,
      balance: balance,
      note: note,
    });
    return body;
  } catch (e) {
    throw new AccountError({
      requestID: e.requestID,
      message: e.message,
      code: e.code,
    });
  }
};

export const updateAccount = async ({
  account_id = '',
  account_name = 0,
  balance = '',
  note = '',
} = {}) => {
  try {
    const body = await sendPostRequest(UPDATE_ACCOUNT, {
      account_id: account_id,
      account_name: account_name,
      balance: balance,
      note: note,
    });
    return body;
  } catch (e) {
    throw new AccountError({
      requestID: e.requestID,
      message: e.message,
      code: e.code,
    });
  }
};
