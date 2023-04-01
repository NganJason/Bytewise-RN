import { StyleSheet } from 'react-native';
import { useTheme } from '@rneui/themed';

import BaseText from './BaseText';

import { CURRENCY } from '../_shared/api/data/mock/user';

const AmountText = ({ children = 0, showSymbol = false, style = {} }) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  const getAmountAttr = () => {
    if (children > 0) {
      return { styles: styles.positive, symbol: '+' };
    }
    return { styles: styles.negative, symbol: '-' };
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
    <BaseText style={{ ...getAmountAttr().styles, ...style }}>
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
      color: theme.colors.red0,
    },
  });
