import { newCategory } from '../../../backend/src/domain/entity/category';

export const newCreateCategoryReq = (cat_name, cat_type) => {
  return {
    cat_id: 0,
    cat_name: cat_name,
    cat_type: cat_type,
  };
};

export const toCategoryEntity = categoryReq => {
  const categoryEntity = newCategory(
    categoryReq.cat_id,
    categoryReq.cat_name,
    categoryReq.cat_type,
  );

  return categoryEntity;
};

export const toGetCategoriesResp = categoryEntities => {
  const categories = [];
  categoryEntities.forEach(d => {
    categories.push({
      cat_id: d.cat_id,
      cat_name: d.cat_name,
      cat_type: d.cat_type,
    });
  });

  return categories;
};
