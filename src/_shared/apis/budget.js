import { AppError, sendPostRequest } from './http';

export class BudgetError extends AppError {
  constructor({ requestID = '', message = '', code = 0 } = {}) {
    super({ requestID, message, code });
  }
}

const GET_CATEGORY_BUDGET = '/get_category_budget';
const GET_CATEGORIES_BUDGET = '/get_categories_budget';
const CREATE_BUDGET = '/create_budget';
const UPDATE_BUDGET = '/update_budget';
const DELETE_BUDGET = '/delete_budget';
const CREATE_BUDGETS = '/create_budgets';

export const getCategoryBudget = async ({
  category_id = '',
  budget_date = '',
} = {}) => {
  try {
    const body = await sendPostRequest(GET_CATEGORY_BUDGET, {
      category_id: category_id,
      budget_date: budget_date,
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

export const getCategoriesBudget = async ({
  category_ids = [],
  budget_date = '',
} = {}) => {
  try {
    const body = await sendPostRequest(GET_CATEGORIES_BUDGET, {
      category_ids: category_ids,
      budget_date: budget_date,
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

export const createBudget = async ({
  budget_date = '',
  category_id = '',
  budget_type = 0,
  budget_repeat = 0,
  amount = '0',
} = {}) => {
  try {
    const body = await sendPostRequest(CREATE_BUDGET, {
      budget_date: budget_date,
      category_id: category_id,
      budget_type: budget_type,
      budget_repeat: budget_repeat,
      amount: String(amount),
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

export const updateBudget = async ({
  budget_date = '',
  category_id = '',
  budget_type = 0,
  budget_repeat = 0,
  amount = '0',
} = {}) => {
  try {
    const body = await sendPostRequest(UPDATE_BUDGET, {
      budget_date: budget_date,
      category_id: category_id,
      budget_type: budget_type,
      budget_repeat: budget_repeat,
      amount: String(amount),
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

export const deleteBudget = async ({
  budget_date = '',
  category_id = '',
  budget_repeat = 0,
} = {}) => {
  try {
    const body = await sendPostRequest(DELETE_BUDGET, {
      budget_date: budget_date,
      category_id: category_id,
      budget_repeat: budget_repeat,
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

export const createBudgets = async ({ budgets = [] } = {}) => {
  try {
    const body = await sendPostRequest(CREATE_BUDGETS, {
      budgets: budgets,
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
