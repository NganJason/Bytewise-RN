import { newCategory } from '../domain/entity/category';

export const toCategoryPo = categoryEntity => {
  return {
    id: categoryEntity.category_id,
    category_name: categoryEntity.category_name,
    category_type: categoryEntity.category_type,
  };
};

export const toCategoryEntity = (id, categoryPo) => {
  return newCategory(id, categoryPo.category_name, categoryPo.category_type);
};
