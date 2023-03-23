import { useMutation } from 'react-query';
import { getGlobalDao } from '../api/api';

export const useCreateCategory = options => {
  const createCategory = async req => {
    const resp = await getGlobalDao().createCategory(req);

    return resp;
  };

  return useMutation(createCategory, options);
};
