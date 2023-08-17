import { useEffect } from 'react';
import { toastError } from '../util';

const useError = (queries = []) => {
  useEffect(() => {
    toastError(queries);
  }, queries);
};

export default useError;
