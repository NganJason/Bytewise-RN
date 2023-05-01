import { getCategoryRepo } from '../../../repository/0_registry';

export const createCategory = async categoryEntity => {
  categoryEntity.validate();

  const newCat = await getCategoryRepo().create(categoryEntity);
  return newCat;
};
