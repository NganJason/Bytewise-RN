import { getCurrencies } from '../apis/currency';
import { queryKeys, useQueryWrapper } from './keys';

export const useGetCurrencies = ({} = {}, opts = {}) => {
  return useQueryWrapper({
    queryFn: () => getCurrencies(),
    queryKey: [queryKeys.currencies],
    onSuccess: opts.onSuccess || function () {},
    enabled: opts.enabled,
  });
};
