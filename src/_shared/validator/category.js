export const validateCategory = ({
  category_name = '',
  category_type = 0,
} = {}) => {
  let errors = {};
  if (category_name === '') {
    errors.category_name = 'Category name cannot be empty';
  }
  if (category_type === 0) {
    errors.category_name = 'Category type cannot be empty';
  }
  return errors;
};
