import { searchSecurities } from '../apis/security';
import { queryKeys, useQueryWrapper } from './keys';

export const useSearchSecurities = ({ keyword = '' } = {}, opts = {}) => {
  return useQueryWrapper({
    queryFn: () => searchSecurities({ keyword: keyword }),
    queryKey: [queryKeys.securities, keyword],
    onSuccess: opts.onSuccess || function () {},
    enabled: opts.enabled,
  });
};
