import { CategoryError } from '../util/error';
import { categoryCollection } from './1_constant';
import { toCategoryEntity, toCategoryPo } from './2_converter';

export const newCategoryRepo = firestoreInstance => {
  const repo = new CategoryRepo(firestoreInstance);
  return repo;
};

class CategoryRepo {
  constructor(firestoreInstance) {
    this.collection = categoryCollection;
    this.fs = firestoreInstance;
  }

  async create(categoryEntity) {
    try {
      await this.fs.insertOne(toCategoryPo(categoryEntity), this.collection);
    } catch (err) {
      throw new CategoryError(`Create category error ${err.message}`);
    }
  }

  async getMany() {
    try {
      const data = await this.fs.getMany(this.collection);
      const categoryEntities = [];

      data.forEach(d => {
        categoryEntities.push(toCategoryEntity(d.id, d.data()));
      });

      return categoryEntities;
    } catch (err) {
      throw new CategoryError(`Get categories error ${err.message}`);
    }
  }
}
