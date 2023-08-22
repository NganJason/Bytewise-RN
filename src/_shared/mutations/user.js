import { useMutation } from '@tanstack/react-query';
import { login, signup, verifyEmail } from '../apis/user';

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

export const useVerifyEmail = (opts = {}) => {
  return useMutation({
    mutationFn: verifyEmail,
    onSuccess: () => {
      opts.onSuccess && opts.onSuccess();
    },
  });
};
