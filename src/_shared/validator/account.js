export const validateAccount = ({ account_name = '' } = {}) => {
  const errors = {};

  if (account_name === '') {
    errors.account_name = 'Account name cannot be empty';
  }
  return errors;
};
