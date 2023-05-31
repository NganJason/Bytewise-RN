import { AppError, sendPostRequest } from './http';

export class UserError extends AppError {
  constructor({ requestID = '', message = '', code = 0 } = {}) {
    super({ requestID, message, code });
  }
}

const LOGIN_USER = '/login_user';
const SIGNUP_USER = '/signup_user';
const VERIFY_USER_AUTH = '/verify_user_auth';

export const loginUser = async ({ email = '', password = '' }) => {
  try {
    // const body = await sendPostRequest(LOGIN_USER, {
    //   email: email,
    //   password: password,
    // });

    return new Promise(resolve => {
      setTimeout(() => {
        const user = { email: 'test' };
        resolve(user);
      }, 1000);
    });
  } catch (e) {
    throw new UserError({
      requestID: e.requestID,
      message: e.message,
      code: e.code,
    });
  }
};

export const signupUser = async ({ email = '', password = '' }) => {
  try {
    // const body = await sendPostRequest(SIGNUP_USER, {
    //   email: email,
    //   password: password,
    // });

    return new Promise(resolve => {
      setTimeout(() => {
        const user = { email: 'test' };
        resolve(user);
      }, 1000);
    });
  } catch (e) {
    throw new UserError({
      requestID: e.requestID,
      message: e.message,
      code: e.code,
    });
  }
};

export const verifyAuth = async () => {
  try {
    // const body = await sendPostRequest(VERIFY_USER_AUTH, {
    //   email: email,
    //   password: password,
    // });

    return new Promise(resolve => {
      setTimeout(() => {
        const user = { email: 'test' };
        resolve(user);
      }, 1000);
    });
  } catch (e) {
    throw new UserError({
      requestID: e.requestID,
      message: e.message,
      code: e.code,
    });
  }
};
