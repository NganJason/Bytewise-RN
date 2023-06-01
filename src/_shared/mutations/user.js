import { useMutation } from '@tanstack/react-query';
import { loginUser, signupUser } from '../apis/user';

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
