import { AppError, sendPostRequest } from './http';

export class MetricError extends AppError {
  constructor({ requestID = '', message = '', code = 0 } = {}) {
    super({ requestID, message, code });
  }
}

const GET_METRICS = '/get_metrics';

export const getMetrics = async ({ metric_type = 0 } = {}) => {
  try {
    const body = await sendPostRequest(GET_METRICS, {
      metric_type: metric_type,
    });
    return body;
  } catch (e) {
    throw new MetricError({
      requestID: e.requestID,
      message: e.message,
      code: e.code,
    });
  }
};
