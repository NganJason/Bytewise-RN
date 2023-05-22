import { AppError, sendPostRequest } from './http';

export class BudgetError extends AppError {
  constructor({ requestID = '', message = '', code = 0 } = {}) {
    super({ requestID, message, code });
  }
}

const GET_CATEGORY_BUDGETS_BY_MONTH = '/get_category_budgets_by_month';
const GET_ANNUAL_BUDGET_BREAKDOWN = '/get_annual_budget_breakdown';
const SET_BUDGET = '/set_budget';

export const getCategoryBudgetsByMonth = async ({ year = 0, month = 0 }) => {
  try {
    const body = await sendPostRequest(GET_CATEGORY_BUDGETS_BY_MONTH, {
      year: year,
      month: month,
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

export const getAnnualBudgetBreakdown = async ({
  category_id = '',
  year = 0,
}) => {
  try {
    const body = await sendPostRequest(GET_ANNUAL_BUDGET_BREAKDOWN, {
      category_id: category_id,
      year: year,
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
  category_id = '',
  year = 0,
  default_budget = null,
  monthly_budget = null,
  budget_config = null,
} = {}) => {
  try {
    const body = await sendPostRequest(SET_BUDGET, {
      category_id: category_id,
      year: year,
      default_budget: default_budget,
      monthly_budget: monthly_budget,
      budget_config: budget_config,
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
