import { Amount } from '../../_shared/object';
import AmountText from './AmountText';

const EarningText = ({ gain = new Amount(), percentGain = 0, ...props }) => {
  const getPercentageSuffix = () => {
    let percentage = Number(percentGain).toFixed(2);
    if (isFinite(percentage)) {
      return `(${percentage}%)`;
    }

    return '(N/A)';
  };

  return (
    <AmountText
      amount={gain}
      suffix={getPercentageSuffix()}
      showColor
      showSign
      {...props}
    />
  );
};

export default EarningText;
