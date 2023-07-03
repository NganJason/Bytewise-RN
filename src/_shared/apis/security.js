import { AppError, sendPostRequest } from './http';

export class SecurityError extends AppError {
  constructor({ requestID = '', message = '', code = 0 } = {}) {
    super({ requestID, message, code });
  }
}

const SEARCH_SECURITIES = '/search_securities';

export const searchSecurities = async ({ keyword = '' } = {}) => {
  try {
    const body = await sendPostRequest(SEARCH_SECURITIES, {
      keyword: keyword,
    });
    return body;
  } catch (e) {
    throw new SecurityError({
      requestID: e.requestID,
      message: e.message,
      code: e.code,
    });
  }
};
