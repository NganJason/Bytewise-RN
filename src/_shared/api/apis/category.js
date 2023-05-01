import {
  getCategories,
  createCategory,
} from '../../../../backend/src/domain/usecase/category';
import { toCategoryEntity, toCreateCategoriesResp } from './0_type';

export const getCategoriesApi = async deviceID => {
  const categoryEntities = await getCategories(deviceID);
  return toCreateCategoriesResp(categoryEntities);
};

export const createCategoryApi = async createCategoryReq => {
  await createCategory(toCategoryEntity(createCategoryReq));
};
