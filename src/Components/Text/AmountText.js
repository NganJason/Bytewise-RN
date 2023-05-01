import { StyleSheet } from 'react-native';
import { useTheme } from '@rneui/themed';

import BaseText from './BaseText';

import { CURRENCY } from '../../_shared/api/mock_data/user';

const AmountText = ({
  children = 0,
  showColor = false,
  showSymbol = false,
  center = false,
  style = {},
  ...props
}) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  const getAmountAttr = () => {
    let symbol = '';
    let colorStyle = {};

    if (children > 0) {
      return { styles: showColor && styles.positive, symbol: '+' };
    }
    if (children < 0) {
      return { styles: showColor && styles.negative, symbol: '-' };
    }

    return { styles: colorStyle, symbol: symbol };
  };

  const renderAmountText = () => {
    let text = '';
    let amount = children;

    // use symbol string to show negative
    if (amount < 0) {
      amount *= -1;
    }

    // add currency
    text = `${CURRENCY} ${amount}`;

    // add + or -
    if (showSymbol) {
      const { symbol } = getAmountAttr();
      text = `${symbol} ${text}`;
    }

    return text;
  };

  return (
    <BaseText
      center={center}
      style={{ ...getAmountAttr()?.styles, ...style }}
      numberOfLines={1}
      {...props}>
      {renderAmountText()}
    </BaseText>
  );
};

export default AmountText;

const getStyles = theme =>
  StyleSheet.create({
    positive: {
      color: theme.colors.color1,
    },
    negative: {
      color: theme.colors.red,
    },
  });
