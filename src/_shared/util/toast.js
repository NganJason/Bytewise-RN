import { BaseToast } from '../../Components/View';

export const toastError = (queryErrors = []) => {
  let err = getErrors(queryErrors);
  if (err === null) {
    return;
  }

  const { error = { message: '' }, reset = function () {} } = err;

  BaseToast.show({
    type: 'error',
    text1: error.message,
    onHIde: reset,
  });
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
