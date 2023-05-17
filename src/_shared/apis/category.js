import { AppError, sendPostRequest } from './http';

export class CategoryError extends AppError {
  constructor(requestID, message, code) {
    super(requestID, message, code);
  }
}

const GET_CATEGORIES = '/get_categories';
const CREATE_CATEGORY = '/create_category';

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

export const createCategory = async ({
  category_name = '',
  category_type = null,
} = {}) => {
  try {
    const body = await sendPostRequest(CREATE_CATEGORY, {
      category_name: category_name,
      category_type: category_type,
    });
    return body;
  } catch (e) {
    throw new CategoryError(e.requestID, e.message, e.code);
  }
};
