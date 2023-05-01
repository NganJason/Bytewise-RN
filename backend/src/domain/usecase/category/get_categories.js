import { getCategoryRepo } from '../../../repository/0_registry';

export const getCategories = async deviceID => {
  // TODO: Change to get by deviceID later
  const categoryEntities = await getCategoryRepo().getMany(deviceID);
  return categoryEntities;
};
