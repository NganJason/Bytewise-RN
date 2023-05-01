import { newCategory } from '../domain/entity/category';

export const toCategoryPo = categoryEntity => {
  return {
    id: categoryEntity.cat_id,
    cat_name: categoryEntity.cat_name,
    cat_type: categoryEntity.cat_type,
  };
};

export const toCategoryEntity = (id, categoryPo) => {
  return newCategory(id, categoryPo.cat_name, categoryPo.cat_type);
};
