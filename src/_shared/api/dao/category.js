import { getFirestore } from '../storage/firestore';

var categoryDao;

export const initCategoryDao = () => {
  if (categoryDao !== undefined) {
    return;
  }

  categoryDao = new CategoryDao();
};

export const getCategoryDao = () => {
  if (categoryDao === undefined) {
    initCategoryDao();
  }

  return categoryDao;
};

class CategoryDao {
  constructor() {
    this.db = getFirestore();
  }
}
