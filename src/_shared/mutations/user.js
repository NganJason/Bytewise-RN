import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createFeedback,
  initUser,
  login,
  signup,
  updateUserMeta,
  verifyEmail,
} from '../apis/user';
import { queryKeys } from '../query';

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

export const useInitUser = (opts = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: initUser,
    onSuccess: () => {
      queryClient.invalidateQueries([queryKeys.user]);
      opts.onSuccess && opts.onSuccess();
    },
  });
};

export const useCreateFeedback = (opts = {}) => {
  return useMutation({
    mutationFn: createFeedback,
    onSuccess: () => {
      opts.onSuccess && opts.onSuccess();
    },
  });
};

export const useUpdateUserMeta = (opts = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateUserMeta,
    onSuccess: () => {
      queryClient.invalidateQueries([queryKeys.user]);
      opts.onSuccess && opts.onSuccess();
    },
  });
};
