import axios from 'axios';

export class AppError extends Error {
  constructor(requestID, message, code) {
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

export const sendPostRequest = async (endpoint = '', body = {}) => {
  try {
    const { data } = await axiosInstance.post(endpoint, body);
    return data.body;
  } catch (e) {
    throw new AppError(
      e.response.headers['request-id'], // request ID
      e.response.data.error, // error message
      e.response.data.code, // error code
    );
  }
};
