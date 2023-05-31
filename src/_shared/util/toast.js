export const renderErrorsToast = (queryErrors = []) => {
  for (let i = 0; i < queryErrors.length; i++) {
    let errObj = renderErrorToast(queryErrors[i]);
    const { show: isError } = errObj;
    if (isError) {
      return errObj;
    }
  }

  return {};
};

export const renderErrorToast = (queryError = {}) => {
  const { isError = false, error = {}, reset = function () {} } = queryError;
  if (isError) {
    return {
      show: isError,
      message1: error?.message || '',
      onHide: reset,
    };
  }

  return {};
};
