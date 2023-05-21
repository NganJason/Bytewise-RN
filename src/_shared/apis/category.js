import { AppError, sendPostRequest } from './http';

export class CategoryError extends AppError {
  constructor({ requestID = '', message = '', code = 0 } = {}) {
    super({ requestID, message, code });
  }
}

export const validateCategory = ({
  category_name = '',
  category_type = 0,
} = {}) => {
  if (category_name === '') {
    throw new CategoryError({ message: 'Category name cannot be empty' });
  }
  if (category_type === 0) {
    throw new Error({ message: 'Category type cannot be 0' });
  }
};

const GET_CATEGORIES = '/get_categories';
const CREATE_CATEGORY = '/create_category';

export const getCategories = async ({ category_type = 0 } = {}) => {
  try {
    const body = await sendPostRequest(GET_CATEGORIES, {
      category_type: category_type,
    });
    return body;
  } catch (e) {
    throw new CategoryError({
      requestID: e.requestID,
      message: e.message,
      code: e.code,
    });
  }
};

export const createCategory = async ({
  category_name = '',
  category_type = 0,
} = {}) => {
  try {
    const body = await sendPostRequest(CREATE_CATEGORY, {
      category_name: category_name,
      category_type: category_type,
    });
    return body;
  } catch (e) {
    throw new CategoryError({
      requestID: e.requestID,
      message: e.message,
      code: e.code,
    });
  }
};
