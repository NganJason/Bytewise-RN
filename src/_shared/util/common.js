export const debounce = (func = function () {}, delayInSecond = 1) => {
  let timeoutId;

  return function (...args) {
    clearTimeout(timeoutId);

    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, delayInSecond * 1000);
  };
};
