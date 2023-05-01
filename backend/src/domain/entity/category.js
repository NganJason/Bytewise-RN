import { CategoryError } from '../../util/error';

export const newCategory = (cat_id, cat_name, cat_type) => {
  const newCat = new Category(cat_id, cat_name, cat_type);
  return newCat;
};

class Category {
  constructor(cat_id, cat_name, cat_type) {
    this.cat_id = cat_id;
    this.cat_name = cat_name;
    this.cat_type = cat_type;
  }

  validate() {
    if (this.cat_name === '') {
      throw new CategoryError('Category name cannot be empty');
    }

    if (this.cat_type === 0) {
      throw new CategoryError('Category type cannot be 0');
    }
  }
}
