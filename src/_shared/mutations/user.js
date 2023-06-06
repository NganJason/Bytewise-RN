import { useMutation } from '@tanstack/react-query';
import { logIn, signUp } from '../apis/user';

export const useLogin = (opts = {}) => {
  return useMutation({
    mutationFn: logIn,
    onSuccess: () => {
      opts.onSuccess && opts.onSuccess();
    },
  });
};

export const useSignup = (opts = {}) => {
  return useMutation({
    mutationFn: signUp,
    onSuccess: () => {
      opts.onSuccess && opts.onSuccess();
    },
  });
};
