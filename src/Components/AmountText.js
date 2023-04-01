import { StyleSheet } from 'react-native';
import { useTheme } from '@rneui/themed';

import BaseText from './BaseText';

import { CURRENCY } from '../_shared/api/data/mock/user';

const AmountText = ({ amount = '', highlight = false }) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  const getTextHighlightStyles = () => {
    if (highlight) {
      switch (amount > 0) {
        case true:
          return styles.positive;
        case false:
          return styles.negative;
      }
    }
  };

  return (
    <BaseText style={getTextHighlightStyles()}>
      {amount !== '' && `${CURRENCY} ${amount}`}
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
