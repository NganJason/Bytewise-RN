import { isTsLargerThanCurrTime } from '../util';

export const validateHolding = ({ symbol = '' } = {}) => {
  const errors = {};
  if (symbol === '') {
    errors.symbol = 'Symbol cannot be empty';
  }
  return errors;
};

export const validateLot = ({ shares = 0, trade_date = 0 }) => {
  const errors = {};
  if (shares === 0) {
    errors.shares = 'Shares cannot be empty';
  }
  if (trade_date === 0) {
    errors.trade_date = 'Trade date cannot be empty';
  }
  if (isTsLargerThanCurrTime(trade_date)) {
    errors.trade_date = 'Trade date cannot be larger than current date';
  }
  return errors;
};
