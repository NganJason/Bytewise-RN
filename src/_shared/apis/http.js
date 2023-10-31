import axios from 'axios';
import { ErrCode } from '../constant/errcode';
import * as Localization from 'expo-localization';

export class AppError extends Error {
  constructor({ requestID = '', message = '', code = 0 } = {}) {
    super(message);
    this.code = code;
    this.requestID = requestID;
  }
}

var axiosInstance;

export const initAxios = ({ baseURL = '' } = {}) => {
  axiosInstance = axios.create({
    baseURL: baseURL,
    timeout: 5000, // 5s
  });
};

export const setAxiosAccessToken = (accessToken = '') => {
  if (axiosInstance !== null) {
    axiosInstance.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
  }
};

export const unsetAxiosAccessToken = () => {
  if (axiosInstance !== null) {
    delete axiosInstance.defaults.headers.common.Authorization;
  }
};

export const isAxiosTokenSet = () => {
  return axiosInstance.defaults.headers.common.Authorization !== undefined;
};

export const setAxiosResponseInterceptors = ({ on401 }) => {
  if (axiosInstance != null) {
    axiosInstance.interceptors.response.use(
      response => {
        return response;
      },
      error => {
        if (error.response) {
          if (
            error.response.status === ErrCode.ErrUnauthorized &&
            on401 !== null
          ) {
            on401();
          }
        }
        return Promise.reject(error);
      },
    );
  }
};

export const sendPostRequest = async (
  endpoint = '',
  body = {},
  { signal } = {},
) => {
  try {
    const { data } = await axiosInstance.post(
      endpoint,
      {
        app_meta: {
          timezone: Localization.timezone,
        },
        ...body,
      },
      { signal },
    );
    return data?.body;
  } catch (e) {
    console.log(
      `
      --------------------------
      cmd=${endpoint}
      token=${axiosInstance.defaults.headers.common.Authorization}
      error=${e}
      --------------------------
      `,
    );
    throw new AppError({
      requestID: e.response?.headers['request-id'], // request ID
      message: e.response?.data.error, // error message
      code: e.response?.data.code, // error code
    });
  }
};
