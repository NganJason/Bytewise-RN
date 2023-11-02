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
const DELETE_HOLDING = '/delete_holding';
const CREATE_LOT = '/create_lot';
const GET_LOT = '/get_lot';
const GET_LOTS = '/get_lots';
const UPDATE_LOT = '/update_lot';
const DELETE_LOT = '/delete_lot';

export const searchSecurities = async ({ symbol = '' } = {}, { signal }) => {
  try {
    const body = await sendPostRequest(
      SEARCH_SECURITIES,
      {
        symbol: symbol,
      },
      { signal },
    );
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
  total_cost = 0,
  latest_value = 0,
  currency = '',
  lots = [],
}) => {
  try {
    const body = await sendPostRequest(CREATE_HOLDING, {
      account_id: account_id,
      symbol: symbol,
      holding_type: holding_type,
      total_cost: total_cost !== null ? String(total_cost) : total_cost,
      latest_value: latest_value !== null ? String(latest_value) : latest_value,
      currency: currency,
      lots:
        lots.length > 0
          ? [
              {
                shares: String(lots[0].shares),
                cost_per_share: String(lots[0].cost_per_share),
              },
            ]
          : [],
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

export const deleteHolding = async ({ holding_id = '' }) => {
  try {
    const body = await sendPostRequest(DELETE_HOLDING, {
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
  symbol = '',
  holding_id = '',
  total_cost = 0,
  latest_value = 0,
  lots = [],
}) => {
  try {
    const body = await sendPostRequest(UPDATE_HOLDING, {
      holding_id: holding_id,
      symbol: symbol,
      total_cost: total_cost !== null ? String(total_cost) : total_cost,
      latest_value: latest_value !== null ? String(latest_value) : latest_value,
      lots:
        lots.length > 0
          ? [
              {
                lot_id: lots[0].lot_id,
                shares: String(lots[0].shares),
                cost_per_share: String(lots[0].cost_per_share),
              },
            ]
          : [],
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

export const updateLot = async ({
  lot_id = '',
  shares = 0,
  cost_per_share = 0,
  trade_date = 0,
}) => {
  try {
    const body = await sendPostRequest(UPDATE_LOT, {
      lot_id: lot_id,
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

export const deleteLot = async ({ lot_id = '' }) => {
  try {
    const body = await sendPostRequest(DELETE_LOT, {
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
