import {
  getHolding,
  getLot,
  getLots,
  searchSecurities,
} from '../apis/investment';
import { queryKeys, useQueryWrapper } from './keys';

export const useSearchSecurities = ({ keyword = '' } = {}, opts = {}) => {
  return useQueryWrapper({
    queryFn: () => searchSecurities({ keyword: keyword }),
    queryKey: [queryKeys.securities, { keyword: keyword }],
    onSuccess: opts.onSuccess || function () {},
    enabled: opts.enabled,
    ...opts,
  });
};

export const useGetHolding = ({ holding_id = '' } = {}, opts = {}) => {
  return useQueryWrapper({
    queryFn: () => getHolding({ holding_id: holding_id }),
    queryKey: [queryKeys.holding, holding_id],
    onSuccess: opts.onSuccess || function () {},
    enabled: opts.enabled,
    ...opts,
  });
};

export const useGetLot = ({ lot_id = '' } = {}, opts = {}) => {
  return useQueryWrapper({
    queryFn: () => getLot({ lot_id: lot_id }),
    queryKey: [queryKeys.lot, lot_id],
    onSuccess: opts.onSuccess || function () {},
    enabled: opts.enabled,
    ...opts,
  });
};

export const useGetLots = ({ holding_id = '' } = {}, opts = {}) => {
  return useQueryWrapper({
    queryFn: () => getLots({ holding_id: holding_id }),
    queryKey: [queryKeys.lots, holding_id],
    onSuccess: opts.onSuccess || function () {},
    enabled: opts.enabled,
    ...opts,
  });
};
