import { BaseToast } from '../../Components/View';
import { defaultErrorText1, defaultErrorText2 } from '../constant/message';

export const toastError = (queryErrors = []) => {
  let err = getErrors(queryErrors);
  if (err === null) {
    return;
  }

  const { error = { message: '', code: 0 }, reset = function () {} } =
    err || {};

  console.log('-----', error, error.code);

  if (error.message === '') {
    BaseToast.show({
      type: 'error',
      text1: defaultErrorText1,
      text2: defaultErrorText2,
      onHide: reset,
    });
  } else {
    BaseToast.show({
      type: 'error',
      text1: error.message,
      onHide: reset,
    });
  }
};

export const getErrors = (queryErrors = []) => {
  for (let i = 0; i < queryErrors.length; i++) {
    const { isError = false } = queryErrors[i];
    if (isError) {
      return queryErrors[i];
    }
  }

  return null;
};
