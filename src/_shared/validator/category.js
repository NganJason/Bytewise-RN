import { CategoryError } from '../util/error';

export const validateCategory = ({ category_name = '', category_type = 0 }) => {
  if (category_name === '') {
    throw new CategoryError('Category Name cannot be empty');
  }
  if (category_type === 0) {
    throw new CategoryError('Category Type cannot be 0');
  }
};
