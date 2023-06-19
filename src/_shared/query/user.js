import { getUser } from '../apis/user';
import { queryKeys, useQueryWrapper } from './keys';

export const useGetUser = (opts = {}) => {
  return useQueryWrapper({
    queryFn: () => getUser({}),
    queryKey: [queryKeys.user],
    onSuccess: opts.onSuccess || function () {},
    enabled: opts.enabled,
  });
};
