import { METRIC_STATUS_HEALTHY } from '../apis/enum';

export const isMetricHealthy = status => {
  return status === METRIC_STATUS_HEALTHY;
};
