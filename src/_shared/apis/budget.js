import { AppError, sendPostRequest } from './http';

export class BudgetError extends AppError {
  constructor({ requestID = '', message = '', code = 0 } = {}) {
    super({ requestID, message, code });
  }
}

export const validateBudget = ({
  budget_name = '',
  budget_amount = 0,
  category_ids = [],
  from_date = new Date(),
  to_date = new Date(),
} = {}) => {
  if (budget_name === '') {
    throw new BudgetError({ message: 'Budget name cannot be empty' });
  }
  if (budget_amount === 0) {
    throw new BudgetError({ message: 'Budget amount cannot be 0' });
  }
  if (category_ids.length === 0) {
    throw new BudgetError({ message: 'Categories cannot be empty' });
  }
  if (to_date < from_date) {
    throw new BudgetError({
      message: 'To date cannot be smaller than from date',
    });
  }
};

const SET_BUDGET = '/set_budget';
const GET_BUDGET = '/get_budget';
const GET_BUDGETS = '/get_budgets';

export const getBudget = async ({ budget_id = '', date = '' } = {}) => {
  try {
    const body = await sendPostRequest(GET_BUDGET, {
      budget_id: budget_id,
      date: date,
    });
    return body;
  } catch (e) {
    throw new BudgetError({
      requestID: e.requestID,
      message: e.message,
      code: e.code,
    });
  }
};

export const getBudgets = async ({ date = '' } = {}) => {
  try {
    const body = await sendPostRequest(GET_BUDGETS, {
      date: date,
    });
    return body;
  } catch (e) {
    throw new BudgetError({
      requestID: e.requestID,
      message: e.message,
      code: e.code,
    });
  }
};

export const setBudget = async ({
  budget_id = null,
  budget_name = '',
  budget_type = 0,
  budget_amount = '0',
  category_ids = [],
  range_start_date = '',
  range_end_date = '',
} = {}) => {
  try {
    const body = await sendPostRequest(SET_BUDGET, {
      budget_id: budget_id,
      budget_name: budget_name,
      budget_type: budget_type,
      budget_amount: budget_amount,
      category_ids: category_ids,
      range_start_date: range_start_date,
      range_end_date: range_end_date,
    });
    return body;
  } catch (e) {
    throw new BudgetError({
      requestID: e.requestID,
      message: e.message,
      code: e.code,
    });
  }
};
