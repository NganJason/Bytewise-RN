import { BaseToast } from '../../Components/View/BaseToast';
import { ErrCode } from '../constant/errcode';
import { defaultErrorText1, defaultErrorText2 } from '../constant/message';

const whitelistedErrCode = [ErrCode.ErrNotFound, ErrCode.ErrParam];

export const toastError = (queryErrors = []) => {
  let err = getErrors(queryErrors);
  if (err === null) {
    return;
  }

  const { error = { message: '', code: 0 }, reset = function () {} } =
    err || {};

  if (error.message !== '' && whitelistedErrCode.includes(error.code)) {
    BaseToast.show({
      type: 'error',
      text1: error.message,
      onHide: reset,
    });
  } else {
    BaseToast.show({
      type: 'error',
      text1: defaultErrorText1,
      text2: defaultErrorText2,
      onHide: reset,
    });
  }
};

const getErrors = (queryErrors = []) => {
  for (let i = 0; i < queryErrors.length; i++) {
    const { isError = false } = queryErrors[i];
    if (isError) {
      return queryErrors[i];
    }
  }

  return null;
};
