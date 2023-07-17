import { AppError, sendPostRequest } from './http';

export class SecurityError extends AppError {
  constructor({ requestID = '', message = '', code = 0 } = {}) {
    super({ requestID, message, code });
  }
}

const SEARCH_SECURITIES = '/search_securities';
const CREATE_HOLDING = '/create_holding';
const GET_HOLDING = '/get_holding';
const UPDATE_HOLDING = '/update_holding';
const CREATE_LOT = '/create_lot';
const GET_LOT = '/get_lot';
const GET_LOTS = '/get_lots';

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

export const createHolding = async ({
  account_id = '',
  symbol = '',
  holding_type = 0,
  latest_value = 0,
  avg_cost = 0,
}) => {
  try {
    const body = await sendPostRequest(CREATE_HOLDING, {
      account_id: account_id,
      symbol: symbol,
      holding_type: holding_type,
      latest_value: String(latest_value),
      avg_cost: String(avg_cost),
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

export const getHolding = async ({ holding_id = '' }) => {
  try {
    const body = await sendPostRequest(GET_HOLDING, {
      holding_id: holding_id,
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

export const updateHolding = async ({
  holding_id = '',
  avg_cost = 0,
  latest_value = 0,
}) => {
  try {
    const body = await sendPostRequest(UPDATE_HOLDING, {
      holding_id: holding_id,
      avg_cost: String(avg_cost),
      latest_value: String(latest_value),
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

export const createLot = async ({
  holding_id = '',
  shares = '',
  cost_per_share = '',
  trade_date = 0,
}) => {
  try {
    const body = await sendPostRequest(CREATE_LOT, {
      holding_id: holding_id,
      shares: shares,
      cost_per_share: cost_per_share,
      trade_date: trade_date,
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

export const getLot = async ({ lot_id = '' }) => {
  try {
    const body = await sendPostRequest(GET_LOT, {
      lot_id: lot_id,
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

export const getLots = async ({ holding_id = '' }) => {
  try {
    const body = await sendPostRequest(GET_LOTS, {
      holding_id: holding_id,
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
