import { TRANSACTION_TYPE_TRANSFER } from '../apis/enum';

export const validateTransaction = ({
  category_id = '',
  account_id = '',
  from_account_id = '',
  to_account_id = '',
  amount = '',
  transaction_type = 0,
  transaction_time = 0,
} = {}) => {
  const errors = {};

  if (amount === '' || amount === 0) {
    errors.amount = 'Amount cannot be empty';
  }

  if (transaction_type === 0) {
    errors.transaction_type = 'Transaction type cannot be empty';
  }

  if (transaction_time === 0) {
    errors.transaction_time = 'Transaction time cannot be empty';
  }

  if (transaction_type === TRANSACTION_TYPE_TRANSFER) {
    if (from_account_id === '') {
      errors.from_account = 'From Account cannot be empty';
    }
    if (to_account_id === '') {
      errors.to_account = 'To Account cannot be empty';
    }
  } else {
    if (account_id === '') {
      errors.account = 'Account cannot be empty';
    }
    if (category_id === '') {
      errors.category = 'Category cannot be empty';
    }
  }

  return errors;
};
