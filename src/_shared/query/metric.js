import { queryKeys, useQueryWrapper } from './keys';
import { getMetrics } from '../apis/metric';

export const useGetMetrics = ({ metric_type = 1 } = {}, opts = {}) => {
  return useQueryWrapper({
    queryFn: () => getMetrics({ metric_type: metric_type }),
    queryKey: [queryKeys.metrics, metric_type],
    onSuccess: opts.onSuccess || function () {},
    enabled: opts.enabled,
  });
};
