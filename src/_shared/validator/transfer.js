export const validateTransfer = ({
  amount = '',
  from_account_id = '',
  to_account_id = '',
} = {}) => {
  const errors = {};

  if (amount === '' || amount === 0) {
    errors.amount = 'Amount cannot be empty';
  }
  if (from_account_id === '') {
    errors.from_account = 'From account cannot be empty';
  }
  if (to_account_id === '') {
    errors.to_account = 'To account cannot be empty';
  }
  return errors;
};
