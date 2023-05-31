import { useMutation } from '@tanstack/react-query';
import { loginUser, signupUser, verifyAuth } from '../apis/user';

export const useLogin = (opts = {}) => {
  return useMutation({
    mutationFn: loginUser,
    ...opts,
  });
};

export const useSignup = (opts = {}) => {
  return useMutation({
    mutationFn: signupUser,
    ...opts,
  });
};

export const useVerifyAuth = (opts = {}) => {
  return useMutation({
    mutationFn: verifyAuth,
    ...opts,
  });
};
