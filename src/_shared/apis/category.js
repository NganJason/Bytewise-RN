import { AppError, sendPostRequest } from './http';

export class CategoryError extends AppError {
  constructor(requestID, message, code) {
    super(requestID, message, code);
  }
}

const GET_CATEGORIES = '/get_categories';

export const getCategories = async ({ category_type = null } = {}) => {
  try {
    const body = await sendPostRequest(GET_CATEGORIES, {
      category_type: category_type,
    });
    return body;
  } catch (e) {
    throw new CategoryError(e.requestID, e.message, e.code);
  }
};
