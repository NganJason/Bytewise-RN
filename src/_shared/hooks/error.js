import { useEffect } from 'react';
import { toastError } from '../util/toast';

export const useError = (queries = []) => {
  useEffect(() => {
    toastError(queries);
  }, queries);
};
