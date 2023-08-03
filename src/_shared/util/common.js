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

export const getProgress = (currValue = 0, totalValue = 0) => {
  let progress = Math.abs(Number(currValue)) / totalValue;
  if (isFinite(progress)) {
    return progress;
  }
  return 0;
};
