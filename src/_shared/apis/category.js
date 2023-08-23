import { AppError, sendPostRequest } from './http';

export class CategoryError extends AppError {
  constructor({ requestID = '', message = '', code = 0 } = {}) {
    super({ requestID, message, code });
  }
}

const GET_CATEGORY = '/get_category';
const GET_CATEGORIES = '/get_categories';
const CREATE_CATEGORY = '/create_category';
const UPDATE_CATEGORY = '/update_category';
const CREATE_CATEGORIES = '/create_categories';

export const getCategory = async ({ category_id = '' } = {}) => {
  try {
    const body = await sendPostRequest(GET_CATEGORY, {
      category_id: category_id,
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

export const updateCategory = async ({
  category_id = '',
  category_name = '',
} = {}) => {
  try {
    const body = await sendPostRequest(UPDATE_CATEGORY, {
      category_id: category_id,
      category_name: category_name,
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

export const createCategories = async ({ categories = [] } = {}) => {
  try {
    const body = await sendPostRequest(CREATE_CATEGORIES, {
      categories: categories,
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
