import { getFs, addFsDoc } from '../storage';
import { AppError } from '../error';

var categoryDao;

class CategoryError extends AppError {
  constructor(message) {
    super(message);
  }
}

class CategoryDao {
  collection = 'category';

  constructor() {
    this.db = getFs();
  }

  async create(category) {
    try {
      await addFsDoc(this.collection, category);
    } catch (err) {
      throw new CategoryError(err.message);
    }
  }
}

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

export const createCateory = async category => {
  await categoryDao.create(category);
  //throw new CategoryError('An error has occured');
};
