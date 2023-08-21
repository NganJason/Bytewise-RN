import { AppError, sendPostRequest } from './http';

export class UserError extends AppError {
  constructor({ requestID = '', message = '', code = 0 } = {}) {
    super({ requestID, message, code });
  }
}

const LOG_IN = '/log_in';
const SIGN_UP = '/sign_up';
const GET_USER = '/get_user';

export const login = async ({ email = '', password = '' }) => {
  try {
    const body = await sendPostRequest(LOG_IN, {
      email: email,
      password: password,
    });
    return body;
  } catch (e) {
    throw new UserError({
      requestID: e.requestID,
      message: e.message,
      code: e.code,
    });
  }
};

export const signup = async ({ email = '', password = '' }) => {
  try {
    const body = await sendPostRequest(SIGN_UP, {
      email: email,
      password: password,
    });
    return body;
  } catch (e) {
    throw new UserError({
      requestID: e.requestID,
      message: e.message,
      code: e.code,
    });
  }
};

export const getUser = async () => {
  try {
    const body = await sendPostRequest(GET_USER, {});
    return body;
  } catch (e) {
    throw new UserError({
      requestID: e.requestID,
      message: e.message,
      code: e.code,
    });
  }
};
