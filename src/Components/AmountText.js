import { StyleSheet } from 'react-native';
import { useTheme } from '@rneui/themed';

import BaseText from './BaseText';

import { CURRENCY } from '../_shared/api/data/mock/user';

const AmountText = ({ amount = '', showSymbol = false }) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  const getAmountAttr = () => {
    if (amount > 0) {
      return { styles: styles.positive, symbol: '+' };
    }
    return { styles: styles.negative, symbol: '-' };
  };

  const renderAmountText = () => {
    let text = '';

    // add currency
    if (amount !== '') {
      text = `${CURRENCY} ${amount}`;
    }

    // add + or -
    if (showSymbol) {
      const { symbol } = getAmountAttr();
      text = `${symbol} ${text}`;
    }

    return text;
  };

  return (
    <BaseText style={getAmountAttr().styles}>{renderAmountText()}</BaseText>
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
