import { useMutation } from '@tanstack/react-query';
import { login, signup } from '../apis/user';

export const useLogin = (opts = {}) => {
  return useMutation({
    mutationFn: login,
    onSuccess: () => {
      opts.onSuccess && opts.onSuccess();
    },
  });
};

export const useSignup = (opts = {}) => {
  return useMutation({
    mutationFn: signup,
    onSuccess: () => {
      opts.onSuccess && opts.onSuccess();
    },
  });
};
