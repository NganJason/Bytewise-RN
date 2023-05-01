import { newCategory } from '../../../../backend/src/domain/entity/category';

export const newCreateCategoryReq = (cat_name, cat_type) => {
  return {
    category_name: cat_name,
    category_type: cat_type,
  };
};

export const toCategoryEntity = createCategoryReq => {
  const categoryEntity = newCategory(
    0,
    createCategoryReq.category_name,
    createCategoryReq.category_type,
  );

  return categoryEntity;
};

export const toCreateCategoriesResp = categoryEntities => {
  const categories = [];
  categoryEntities.forEach(d => {
    categories.push({
      category_id: d.category_id,
      category_name: d.category_name,
      category_type: d.category_type,
    });
  });

  return categories;
};
