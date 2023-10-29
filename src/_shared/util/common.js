export const getProgress = (currValue = 0, totalValue = 0) => {
  let progress = Math.abs(Number(currValue)) / totalValue;
  if (isFinite(progress)) {
    return progress;
  }
  return 0;
};
