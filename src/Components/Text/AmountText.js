import { StyleSheet } from 'react-native';
import { useTheme } from '@rneui/themed';

import BaseText from './BaseText';

import { CURRENCY } from '../../_shared/mock_data/user';

const AmountText = ({
  children = 0,
  showColor = false,
  showSymbol = false,
  center = false,
  style = {},
  decimal = 2,
  ...props
}) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  const getAmountAttr = amount => {
    if (amount > 0) {
      return { styles: showColor && styles.positive, symbol: '+' };
    }

    if (amount < 0) {
      return { styles: showColor && styles.negative, symbol: '-' };
    }

    return { styles: {}, symbol: '' };
  };

  const renderAmountText = () => {
    let text = '';

    children = Number(children);

    const { symbol } = getAmountAttr(children);

    // use symbol string to show negative
    if (children < 0) {
      children = children * -1;
    }

    const amount = Number(children.toFixed(decimal));
    const amountStr = amount.toLocaleString();

    // add currency
    text = `${CURRENCY} ${amountStr}`;

    // add + or -
    if (showSymbol) {
      text = `${symbol} ${text}`;
    }

    return text;
  };

  return (
    <BaseText
      center={center}
      style={{ ...style, ...getAmountAttr(children)?.styles }}
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
