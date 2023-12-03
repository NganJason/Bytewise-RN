export const getLowestHighestValIdx = (numbers = []) => {
  if (numbers.length === 0) {
    return [-1, -1];
  }

  let minValue = numbers[0];
  let maxValue = numbers[0];
  let minIndex = 0;
  let maxIndex = 0;

  for (let i = 1; i < numbers.length; i++) {
    const currentValue = numbers[i];
    if (currentValue < minValue) {
      minValue = currentValue;
      minIndex = i;
    } else if (currentValue > maxValue) {
      maxValue = currentValue;
      maxIndex = i;
    }
  }

  return [minIndex, maxIndex];
};
