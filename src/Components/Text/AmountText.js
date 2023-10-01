import { StyleSheet } from 'react-native';
import { useTheme } from '@rneui/themed';

import BaseText from './BaseText';
import { getCurrencySymbol, DEFAULT_CURRENCY } from '../../_shared/util';
import { useContext } from 'react';
import { UserMetaContext } from '../../_shared/context/UserMetaContext';
import { Amount } from '../../_shared/object';

const AmountText = ({
  children = 0,
  amount = new Amount(),
  showColor = false,
  showSign = false,
  showNegativeOnly = false,
  showPositiveOnly = false,
  center = false,
  style = {},
  decimal = 2,
  suffix = '',
  currency = DEFAULT_CURRENCY,
  sensitive = false,
  ...props
}) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const { shouldHideSensitiveInfo } = useContext(UserMetaContext);

  const getAmountAttr = () => {
    let value = amount.getAmount();
    if (value > 0) {
      return { styles: showColor && styles.positive, sign: '+' };
    }

    if (value < 0) {
      return { styles: showColor && styles.negative, sign: '-' };
    }

    return { styles: {}, sign: '' };
  };

  const renderAmountText = () => {
    let text = '';
    let value = Number(amount.getAmount());
    const { sign } = getAmountAttr();

    // use sign string to show negative
    value = Math.abs(value).toFixed(decimal);
    let amountStr = value.toLocaleString(undefined, { style: 'decimal' });
    if (sensitive && shouldHideSensitiveInfo()) {
      amountStr = '-'.repeat(1);
    }

    let currencySymbol = getCurrencySymbol(amount.getCurrency());
    text = `${currencySymbol} ${amountStr}`;

    let shouldShowSign = false;
    if (showSign) {
      shouldShowSign = true;
    }
    if (showNegativeOnly && sign === '-') {
      shouldShowSign = true;
    }
    if (showPositiveOnly && sign === '+') {
      shouldShowSign = true;
    }

    if (shouldShowSign) {
      text = `${sign} ${text}`;
    }

    if (suffix !== '') {
      text = `${text} ${suffix}`;
    }

    return text;
  };

  return (
    <BaseText
      center={center}
      style={{ ...style, ...getAmountAttr()?.styles }}
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
