export const validateLogin = ({ username = '', password = '' } = {}) => {
  const errors = {};

  if (username === '') {
    errors.username = 'Username cannot be empty';
  } else if (username.length > 60) {
    errors.username = 'Username cannot be more than 60 characters';
  }

  if (password === '') {
    errors.password = 'Password cannot be empty';
  } else if (password.length < 8) {
    errors.password = 'Password must have at least 8 characters';
  }

  return errors;
};
