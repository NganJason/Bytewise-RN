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
const DELETE_ACCOUNT = '/delete_account';
const CREATE_ACCOUNTS = '/create_accounts';
const GET_ACCOUNTS_SUMMARY = '/get_accounts_summary';

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
  currency = '',
  note = '',
} = {}) => {
  try {
    const body = await sendPostRequest(CREATE_ACCOUNT, {
      account_name: account_name,
      account_type: account_type,
      balance: balance,
      currency: currency,
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
  account_name = '',
  balance = '',
  note = '',
  update_mode = 0,
} = {}) => {
  try {
    const body = await sendPostRequest(UPDATE_ACCOUNT, {
      account_id: account_id,
      account_name: account_name,
      balance: balance,
      note: note,
      update_mode: update_mode,
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

export const deleteAccount = async ({ account_id = '' } = {}) => {
  try {
    const body = await sendPostRequest(DELETE_ACCOUNT, {
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

export const createAccounts = async ({ accounts = [] } = {}) => {
  try {
    const body = await sendPostRequest(CREATE_ACCOUNTS, {
      accounts: accounts,
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

export const getAccountsSummary = async ({ unit = 1, interval = 1 } = {}) => {
  try {
    const body = await sendPostRequest(GET_ACCOUNTS_SUMMARY, {
      unit: unit,
      interval: interval,
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
