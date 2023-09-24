import { StyleSheet } from 'react-native';
import { useTheme } from '@rneui/themed';

import BaseText from './BaseText';
import { getCurrencySymbol, CURRENCY_SGD } from '../../_shared/util';
import { useContext } from 'react';
import { UserMetaContext } from '../../_shared/context/UserMetaContext';

const AmountText = ({
  children = 0,
  showColor = false,
  showSymbol = false,
  showNegativeOnly = false,
  showPositiveOnly = false,
  center = false,
  style = {},
  decimal = 2,
  suffix = '',
  currency = CURRENCY_SGD,
  sensitive = false,
  ...props
}) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const { shouldHideSensitiveInfo } = useContext(UserMetaContext);

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
    children = Math.abs(children);
    let amountStr = children.toLocaleString(undefined, { style: 'decimal' });
    if (sensitive && shouldHideSensitiveInfo()) {
      amountStr = '*'.repeat(4);
    }

    let currencySymbol = getCurrencySymbol(currency);
    text = `${currencySymbol} ${amountStr}`;
    let shouldShowSymbol = false;

    if (showSymbol) {
      shouldShowSymbol = true;
    }
    if (showNegativeOnly && symbol === '-') {
      shouldShowSymbol = true;
    }
    if (showPositiveOnly && symbol === '+') {
      shouldShowSymbol = true;
    }

    if (shouldShowSymbol) {
      text = `${symbol} ${text}`;
    }

    if (suffix !== '') {
      text = `${text} ${suffix}`;
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
      color: theme.colors.regularRed,
    },
  });
