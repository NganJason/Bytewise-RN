export const getIDToCategoryMap = (categories = []) => {
  let categoryMap = {};

  categories.map(cat => {
    categoryMap[cat.category_id] = cat;
  });

  return categoryMap;
};
