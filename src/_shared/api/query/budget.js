import { AppError, ValidationError } from '../error';

class BudgetError extends AppError {
  constructor(message) {
    super(message);
  }
}

export const createBudget = () => {
  try {
    console.log('create budget');
  } catch (err) {
    handleError(err);
  }
};

export const getBudget = () => {
  try {
    console.log('get budget');
  } catch (err) {
    handleError(err);
  }
};

const handleError = err => {
  switch (true) {
    case err instanceof ValidationError:
      throw new BudgetError('invalid budget');
    default:
      throw err;
  }
};
