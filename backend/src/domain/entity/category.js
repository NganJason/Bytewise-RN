import { CategoryError } from '../../util/error';

export const newCategory = (cat_id, cat_name, cat_type) => {
  const newCat = new Category(cat_id, cat_name, cat_type);
  return newCat;
};

class Category {
  constructor(cat_id, cat_name, cat_type) {
    this.category_id = cat_id;
    this.category_name = cat_name;
    this.category_type = cat_type;
  }

  validate() {
    if (this.category_name === '') {
      throw new CategoryError('Category name cannot be empty');
    }

    if (this.category_type === 0) {
      throw new CategoryError('Category type cannot be 0');
    }
  }
}
