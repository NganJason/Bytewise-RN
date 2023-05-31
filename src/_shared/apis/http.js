import axios from 'axios';
import { ErrCode } from '../constant/errcode';

export class AppError extends Error {
  constructor({ requestID = '', message = '', code = 0 } = {}) {
    super(message);
    this.code = code;
    this.requestID = requestID;
  }
}

var axiosInstance;
var handleUnauthenticate = function () {};

export const initAxios = ({
  baseURL = '',
  unauthenticateHandler = function () {},
} = {}) => {
  axiosInstance = axios.create({
    baseURL: baseURL,
    timeout: 5000, // 5s
  });

  handleUnauthenticate = unauthenticateHandler;
};

export const sendPostRequest = async (endpoint = '', body = {}) => {
  try {
    const { data } = await axiosInstance.post(endpoint, body);
    return data.body;
  } catch (e) {
    if (e.response && e.response.status === ErrCode.unauthenticate) {
      handleUnauthenticate();
    }

    throw new AppError({
      requestID: e.response?.headers['request-id'], // request ID
      message: e.response?.data.error, // error message
      code: e.response?.data.code, // error code
    });
  }
};
