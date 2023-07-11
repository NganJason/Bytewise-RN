export const validateBudget = ({
  budget_name = '',
  budget_amount = 0,
  category_ids = [],
  from_date = new Date(),
  to_date = new Date(),
} = {}) => {
  const errors = {};

  if (budget_name === '') {
    errors.budget_name = 'Budget name cannot be empty';
  }
  if (budget_amount === 0 || budget_amount === '') {
    errors.budget_amount = 'Budget amount cannot be 0';
  }
  if (category_ids.length === 0) {
    errors.categories = 'Categories cannot be empty';
  }
  if (to_date < from_date) {
    errors.date = 'From date cannot be larger than to date';
  }
  return errors;
};
