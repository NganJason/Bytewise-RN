import AmountText from './AmountText';

const EarningText = ({ currVal = 0, initialVal = 0, ...props }) => {
  const getEarning = () => {
    return currVal - initialVal;
  };

  const getEarningPercentage = () => {
    let percentage = (getEarning() / initialVal) * 100;
    if (isNaN(percentage)) {
      return 0;
    }
    return percentage.toFixed(2);
  };

  const getPercentageSuffix = () => {
    return `(${getEarningPercentage()}%)`;
  };

  return (
    <AmountText suffix={getPercentageSuffix()} showColor showSymbol {...props}>
      {getEarning()}
    </AmountText>
  );
};

export default EarningText;
