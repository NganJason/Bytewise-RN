import AmountText from './AmountText';

const EarningText = ({ currVal = 0, initialVal = 0, ...props }) => {
  const getEarning = () => {
    return currVal - initialVal;
  };

  const getEarningPercentage = () => {
    let percentage = (currVal - initialVal) / initialVal;
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
