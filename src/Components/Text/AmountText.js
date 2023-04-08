import { StyleSheet } from 'react-native';
import { useTheme } from '@rneui/themed';

import BaseText from './BaseText';

import { CURRENCY } from '../../_shared/api/data/mock/user';

const AmountText = ({
  children = 0,
  showSymbol = false,
  style = {},
  showColor = true,
  ...props
}) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  const getAmountAttr = () => {
    if (children > 0) {
      return { styles: showColor && styles.positive, symbol: '+' };
    }
    if (children < 0) {
      return { styles: showColor && styles.negative, symbol: '-' };
    }
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
      color: theme.colors.primary,
    },
    negative: {
      color: theme.colors.red,
    },
  });
