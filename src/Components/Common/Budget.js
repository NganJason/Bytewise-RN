import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme, LinearProgress } from '@rneui/themed';

import BaseText from '../Text/BaseText';
import AmountText from '../Text/AmountText';

const Budget = ({
  budget: {
    category: { cat_name = '' },
    amount = '',
    used = '',
  },
}) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  return (
    <TouchableOpacity style={styles.budgetContainer}>
      <View style={styles.textGroup}>
        <BaseText>{cat_name}</BaseText>
        <AmountText showColor={false}>{amount - used}</AmountText>
      </View>
      <LinearProgress
        trackColor={theme.colors.color4}
        color={theme.colors.color1}
        value={used / amount}
      />
    </TouchableOpacity>
  );
};

export default Budget;

const getStyles = _ => {
  return StyleSheet.create({
    budgetContainer: {
      width: '100%',
    },
    textGroup: {
      flexDirection: 'row',
      marginBottom: 12,
      justifyContent: 'space-between',
    },
  });
};
