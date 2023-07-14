import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createHolding, createLot } from '../apis/investment';
import { queryKeys } from '../query';

export const useCreateHolding = (opts = {}) => {
  const queryClient = useQueryClient();

  return useMutation(createHolding, {
    onSuccess: ({ holding = {} }) => {
      const { account_id = '' } = holding;
      // refetch account info
      queryClient.invalidateQueries([queryKeys.account, account_id]);

      opts.onSuccess && opts.onSuccess();
    },
  });
};

export const useCreateLot = (opts = {}) => {
  const queryClient = useQueryClient();
  const { account_id = '' } = opts?.meta || {};

  return useMutation(createLot, {
    onSuccess: ({ lot = {} }) => {
      const { holding_id = '' } = lot;

      queryClient.invalidateQueries([queryKeys.holding, holding_id]);
      queryClient.invalidateQueries([queryKeys.lots, holding_id]);
      queryClient.invalidateQueries([queryKeys.account, account_id]);
      queryClient.invalidateQueries([queryKeys.accounts]);

      opts.onSuccess && opts.onSuccess();
    },
  });
};
