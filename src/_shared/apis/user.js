import { AppError, sendPostRequest } from './http';

export class UserError extends AppError {
  constructor({ requestID = '', message = '', code = 0 } = {}) {
    super({ requestID, message, code });
  }
}

const LOG_IN = '/log_in';
const SIGN_UP = '/sign_up';
const GET_USER = '/get_user';
const VERIFY_EMAIL = '/verify_email';
const INIT_USER = '/init_user';
const CREATE_FEEDBACK = '/create_feedback';

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

export const verifyEmail = async ({ email = '', code = '' }) => {
  try {
    const body = await sendPostRequest(VERIFY_EMAIL, {
      email: email,
      code: code,
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

export const initUser = async ({}) => {
  try {
    const body = await sendPostRequest(INIT_USER, {});
    return body;
  } catch (e) {
    throw new UserError({
      requestID: e.requestID,
      message: e.message,
      code: e.code,
    });
  }
};

export const createFeedback = async ({ score = 0, text = '' }) => {
  try {
    const body = await sendPostRequest(CREATE_FEEDBACK, {
      score: score,
      text: text,
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
