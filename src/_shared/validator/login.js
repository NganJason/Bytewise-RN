export const validateLogin = ({ email = '', password = '' } = {}) => {
  const errors = {};

  if (email === '') {
    errors.email = 'Email address cannot be empty';
  } else if (email.length > 60) {
    errors.email = 'Email address cannot be more than 60 characters';
  }

  if (password === '') {
    errors.password = 'Password cannot be empty';
  } else if (password.length < 8) {
    errors.password = 'Password must have at least 8 characters';
  }

  return errors;
};
