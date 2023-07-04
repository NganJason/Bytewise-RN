import { useRef } from 'react';

export const debounce = (func = function () {}, delayInSeconds = 1) => {
  const timerIDRef = useRef(null);

  return function (...args) {
    clearTimeout(timerIDRef.current);

    timerIDRef.current = setTimeout(() => {
      func.apply(this, args);
    }, delayInSeconds * 1000);
  };
};
