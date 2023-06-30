import {
  ACCOUNT_TYPE_BIT_SHIFT,
  ACCOUNT_TYPE_BIT_SIZE,
  EQUITY_TYPE_ASSET,
  EQUITY_TYPE_DEBT,
} from '../apis/enum';

export const getEquityType = (accountType = 0) => {
  return (
    (accountType >> ACCOUNT_TYPE_BIT_SHIFT) & ((1 << ACCOUNT_TYPE_BIT_SIZE) - 1)
  );
};

export const isAccountTypeAsset = (accountType = 0) => {
  return ((accountType >> ACCOUNT_TYPE_BIT_SHIFT) & EQUITY_TYPE_ASSET) > 0;
};

export const isAccountTypeDebt = (accountType = 0) => {
  return ((accountType >> ACCOUNT_TYPE_BIT_SHIFT) & EQUITY_TYPE_DEBT) > 0;
};
