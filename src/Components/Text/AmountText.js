import { StyleSheet } from 'react-native';
import { useTheme } from '@rneui/themed';

import BaseText from './BaseText';
import { DEFAULT_CURRENCY, getCurrencyMap } from '../../_shared/util';
import { useContext } from 'react';
import { UserMetaContext } from '../../_shared/context/UserMetaContext';
import { Amount } from '../../_shared/object';

const POSITIVE = '+ ';
const NEGATIVE = '- ';

const AmountText = ({
  children = 0,
  amount = new Amount(),
  showColor = false,
  showSign = false,
  showCurrency = true,
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
      return { styles: showColor && styles.positive, sign: POSITIVE };
    }

    if (value < 0) {
      return { styles: showColor && styles.negative, sign: NEGATIVE };
    }

    return { styles: {}, sign: '' };
  };

  const renderAmountText = () => {
    let text = '';
    const { sign } = getAmountAttr();
    const currencySymbol = getCurrencyMap(amount.getCurrency()).symbol;

    // use sign string to show negative
    let value = parseFloat(Math.abs(amount.getAmount()));
    let amountStr = value.toLocaleString('en-US', {
      style: 'decimal',
      useGrouping: true,
      minimumFractionDigits: decimal,
      maximumFractionDigits: decimal,
    });

    text = `${amountStr}`;
    let shouldShowSign = false;
    if (showSign) {
      shouldShowSign = true;
    }
    if (showNegativeOnly && sign === NEGATIVE) {
      shouldShowSign = true;
    }
    if (showPositiveOnly && sign === POSITIVE) {
      shouldShowSign = true;
    }

    if (sensitive && shouldHideSensitiveInfo()) {
      text = '-';
    }

    if (showCurrency) {
      text = `${currencySymbol} ${text}`;
    }

    if (shouldShowSign && !sensitive) {
      text = `${sign}${text}`;
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
