import { HOLDING_TYPE_DEFAULT } from '../apis/enum';
import { isTsLargerThanCurrTime } from '../util';

export const validateHolding = ({
  symbol = '',
  holding_type = 0,
  lots = [{ shares: 0 }],
} = {}) => {
  const errors = {};
  if (symbol === '') {
    errors.symbol = 'Symbol cannot be empty';
  }

  if (holding_type === HOLDING_TYPE_DEFAULT) {
    if (lots.length !== 1) {
      errors.lots = 'Must have one and only one lot';
    }

    const lot = lots[0];
    if (lot.shares === 0) {
      errors.lots = 'Lot shares cannot be empty';
    }
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

export const validateOnboardingHolding = ({
  symbol = '',
  holding_type = 0,
  lots = [{ shares: 0 }],
}) => {
  const errors = {};
  if (symbol === '') {
    errors.symbol = 'Symbol cannot be empty';
  }

  if (holding_type === HOLDING_TYPE_DEFAULT) {
    if (lots.length !== 1) {
      errors.lots = 'Must have one and only one lot';
    }

    const lot = lots[0];
    if (lot.shares === 0) {
      errors.lots = 'Lot shares cannot be empty';
    }
  }
  return errors;
};
