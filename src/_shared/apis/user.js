import { AppError, sendPostRequest } from './http';

export class UserError extends AppError {
  constructor({ requestID = '', message = '', code = 0 } = {}) {
    super({ requestID, message, code });
  }
}

const LOG_IN = '/log_in';
const SIGN_UP = '/sign_up';
const GET_USER = '/get_user';

export const login = async ({ username = '', password = '' }) => {
  try {
    const body = await sendPostRequest(LOG_IN, {
      username: username,
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

export const signup = async ({ username = '', password = '' }) => {
  try {
    const body = await sendPostRequest(SIGN_UP, {
      username: username,
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
