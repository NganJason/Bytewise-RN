import { CategoryError } from '../util/error';

export const validateCategory = ({ cat_name = '', cat_type = 0 }) => {
  if (cat_name === '') {
    throw new CategoryError('Category Name cannot be empty');
  }
  if (cat_type === 0) {
    throw new CategoryError('Category Type cannot be 0');
  }
};
