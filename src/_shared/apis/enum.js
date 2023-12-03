export const TRANSACTION_TYPE_EXPENSE = 1;
export const TRANSACTION_TYPE_INCOME = 2;
export const TRANSACTION_TYPE_TRANSFER = 3;

export const TRANSACTION_TYPES = {
  [TRANSACTION_TYPE_EXPENSE]: 'Expense',
  [TRANSACTION_TYPE_INCOME]: 'Income',
  [TRANSACTION_TYPE_TRANSFER]: 'Transfer',
};

export const ACCOUNT_TYPE_BIT_SHIFT = 4;
export const ACCOUNT_TYPE_BIT_SIZE = 4;

export const EQUITY_TYPE_ASSET = 1;
export const EQUITY_TYPE_DEBT = 2;

export const EQUITY_TYPES = {
  [EQUITY_TYPE_ASSET]: 'Asset',
  [EQUITY_TYPE_DEBT]: 'debt',
};

export const ACCOUNT_TYPE_CASH = EQUITY_TYPE_ASSET << ACCOUNT_TYPE_BIT_SHIFT;
export const ACCOUNT_TYPE_BANK_ACCOUNT =
  (EQUITY_TYPE_ASSET << ACCOUNT_TYPE_BIT_SHIFT) | 1;
export const ACCOUNT_TYPE_INVESTMENT =
  (EQUITY_TYPE_ASSET << ACCOUNT_TYPE_BIT_SHIFT) | 2;

export const ACCOUNT_TYPE_CREDIT_CARD =
  EQUITY_TYPE_DEBT << ACCOUNT_TYPE_BIT_SHIFT;
export const ACCOUNT_TYPE_LOAN =
  (EQUITY_TYPE_DEBT << ACCOUNT_TYPE_BIT_SHIFT) | 1;
export const ACCOUNT_TYPE_MORTGAGE =
  (EQUITY_TYPE_DEBT << ACCOUNT_TYPE_BIT_SHIFT) | 2;

export const ACCOUNT_TYPES = {
  [ACCOUNT_TYPE_CASH]: 'Cash',
  [ACCOUNT_TYPE_BANK_ACCOUNT]: 'Bank Account',
  [ACCOUNT_TYPE_INVESTMENT]: 'Investment',
  [ACCOUNT_TYPE_CREDIT_CARD]: 'Credit Card',
  [ACCOUNT_TYPE_LOAN]: 'Loan',
  // [ACCOUNT_TYPE_MORTGAGE]: 'Mortgage',
};

export const ACCOUNT_UPDATE_MODE_DEFAULT = 0;
export const ACCOUNT_UPDATE_MODE_OFFSET_TRANSACTION = 1;

export const ACCOUNT_UPDATE_MODES = {
  [ACCOUNT_UPDATE_MODE_DEFAULT]: 'Default',
  [ACCOUNT_UPDATE_MODE_OFFSET_TRANSACTION]: 'Offset Transaction',
};

export const HOLDING_TYPE_DEFAULT = 1;
export const HOLDING_TYPE_CUSTOM = 2;

export const HOLDING_TYPES = {
  [HOLDING_TYPE_DEFAULT]: 'Default',
  [HOLDING_TYPE_CUSTOM]: 'Custom',
};

export const BUDGET_TYPE_MONTHLY = 0;
export const BUDGET_TYPE_ANNUAL = 1;

export const BUDGET_TYPES = {
  [BUDGET_TYPE_MONTHLY]: 'Monthly',
  [BUDGET_TYPE_ANNUAL]: 'Annual',
};

export const BUDGET_REPEAT_ALL_TIME = 0;
export const BUDGET_REPEAT_NOW_TO_FUTURE = 1;
export const BUDGET_REPEAT_NOW = 2;

export const BUDGET_REPEATS = {
  [BUDGET_REPEAT_NOW]: 'This month only',
  [BUDGET_REPEAT_NOW_TO_FUTURE]: 'This month and future months',
  [BUDGET_REPEAT_ALL_TIME]: 'All past and future months',
};

export const USER_FLAG_DEFAULT = 0;
export const USER_FLAG_NEW_USER = 1;

export const USER_FLAGS = {
  [USER_FLAG_DEFAULT]: 'Default user',
  [USER_FLAG_NEW_USER]: 'New user',
};

export const METRIC_TYPE_NET_WORTH = 1;
export const METRIC_TYPE_SAVINGS = 2;

export const METRIC_TYPES = {
  [METRIC_TYPE_NET_WORTH]: 'Net worth',
  [METRIC_TYPE_SAVINGS]: 'Savings',
};

export const METRIC_DEBT_RATIO = 1;
export const METRIC_SAVING_RATIO = 2;
export const METRIC_INVESTMENT_RATIO = 3;

export const METRICS = {
  [METRIC_DEBT_RATIO]: 'Debt Ratio',
  [METRIC_SAVING_RATIO]: 'Savings Ratio',
  [METRIC_INVESTMENT_RATIO]: 'Investment Ratio',
};
