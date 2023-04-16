import { AppError, ValidationError } from '../error';

class CategoryError extends AppError {
  constructor(message) {
    super(message);
  }
}

export const createCategory = () => {
  try {
    console.log('create category');
  } catch (err) {
    handleError(err);
  }
};

export const getCategory = () => {
  try {
    console.log('get category');
  } catch (err) {
    handleError(err);
  }
};

const handleError = err => {
  switch (true) {
    case err instanceof ValidationError:
      throw new CategoryError('invalid category');
    default:
      throw err;
  }
};
