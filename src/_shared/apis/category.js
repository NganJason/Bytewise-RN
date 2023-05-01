import {
  getCategories,
  createCategory,
} from '../../../backend/src/domain/usecase/category';
import { toCategoryEntity, toGetCategoriesResp } from './0_type';

export const getCategoriesApi = async deviceID => {
  const categoryEntities = await getCategories(deviceID);
  return toGetCategoriesResp(categoryEntities);
};

export const createCategoryApi = async createCategoryReq => {
  await createCategory(toCategoryEntity(createCategoryReq));
};
