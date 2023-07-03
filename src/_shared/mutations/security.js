import { useMutation } from '@tanstack/react-query';
import { searchSecurities } from '../apis/security';

export const useSearchSecurities = (opts = {}) => {
  return useMutation(searchSecurities, {
    onSuccess: () => {
      opts.onSuccess && opts.onSuccess();
    },
  });
};
