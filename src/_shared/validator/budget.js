export const validateBudget = ({ amount = 0, category_id = '' } = {}) => {
  const errors = {};

  if (amount === 0 || amount === '') {
    errors.amount = 'Budget amount cannot be 0';
  }
  if (category_id === '') {
    errors.category = 'Category cannot be empty';
  }
  return errors;
};
