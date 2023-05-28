export const renderErrorsToast = (reactQueries = []) => {
  for (let i = 0; i < reactQueries.length; i++) {
    let errObj = renderErrorToast(reactQueries[i]);
    const { isError } = errObj;
    if (isError) {
      return errObj;
    }
  }

  return {};
};

export const renderErrorToast = (reactQuery = {}) => {
  const { isError = false, error = {}, reset = function () {} } = reactQuery;

  if (isError) {
    return {
      show: isError,
      message1: error?.message || '',
      onHide: reset,
    };
  }

  return {};
};
