import { AppError, sendPostRequest } from './http';

export class CurrencyError extends AppError {
  constructor({ requestID = '', message = '', code = 0 } = {}) {
    super({ requestID, message, code });
  }
}

const GET_CURRENCIES = '/get_currencies';

export const getCurrencies = async () => {
  try {
    const body = await sendPostRequest(GET_CURRENCIES, {});
    return body;
  } catch (e) {
    throw new CurrencyError({
      requestID: e.requestID,
      message: e.message,
      code: e.code,
    });
  }
};
