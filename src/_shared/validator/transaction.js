export const validateTransaction = ({
  category_id = '',
  account_id = '',
  amount = '',
  note = '',
  transaction_type = 0,
  transaction_time = 0,
} = {}) => {
  const errors = {};

  if (category_id === '') {
    errors.category = 'Category cannot be empty';
  }
  if (amount === '' || amount === 0) {
    errors.amount = 'Amount cannot be empty';
  }
  if (transaction_type === 0) {
    errors.transaction_type = 'Transaction type cannot be empty';
  }
  if (transaction_time === 0) {
    errors.transaction_type = 'Transaction type cannot be empty';
  }
  if (note === '') {
    errors.note = 'Note cannot be empty';
  }
  if (account_id === '') {
    errors.account = 'Account cannot be empty';
  }
  return errors;
};
