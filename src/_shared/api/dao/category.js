import { getGlobalFirestore } from '../storage';
import { AppError } from '../error';

var categoryDao;

class CategoryError extends AppError {
  constructor(message) {
    super(message);
  }
}

class CategoryDao {
  categoryCollection = 'category';

  constructor() {
    this.fs = getGlobalFirestore();
  }

  async insertOne(category) {
    try {
      await this.fs.withTx(async fsTx => {
        await fsTx.insertOne(category, this.categoryCollection);
      });
    } catch (err) {
      throw new CategoryError('Create Category Error', err.message);
    }
  }

  async getMany() {
    try {
      const data = await this.fs.getMany(this.categoryCollection);
      const categories = [];
      data.forEach(d => {
        const category = { category_id: d.id, ...d.data() };
        categories.push(category);
      });
      return categories;
    } catch (err) {
      throw new CategoryError(err.message);
    }
  }
}

export const createCategory = async category => {
  await categoryDao.insertOne(category);
};

export const getCategories = async () => {
  return await categoryDao.getMany();
};

export const validateCategory = ({ category_name = '', category_type = 0 }) => {
  if (category_name === '') {
    throw new CategoryError('Category Name cannot be empty');
  }
  if (category_type === 0) {
    throw new CategoryError('Category Type cannot be 0');
  }
};

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
