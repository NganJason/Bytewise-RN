import { Amount } from '../../_shared/object';
import AmountText from './AmountText';

const EarningText = ({ gain = new Amount(), percentGain = null, ...props }) => {
  const getPercentageSuffix = () => {
    if (percentGain === null) {
      return '';
    }

    let percentage = Number(percentGain).toFixed(2);
    if (isFinite(percentage)) {
      return `(${percentage}%)`;
    }

    return '';
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
