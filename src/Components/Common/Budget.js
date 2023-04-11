import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme, LinearProgress } from '@rneui/themed';

import BaseText from '../Text/BaseText';
import AmountText from '../Text/AmountText';

const Budget = ({
  budget: {
    category: {},
    budget = '',
    used = '',
  },
}) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  return (
    <TouchableOpacity style={styles.budgetContainer}>
      <View>
        <BaseText>Budget</BaseText>
        <AmountText>Budget</AmountText>
      </View>
      <LinearProgress
        trackColor={theme.colors.color4}
        color={theme.colors.color1}
        value={0.5}
      />
      <LinearProgress
        value={0.1}
        variant="determinate"
        style={{ width: '100%' }}
        color="secondary"
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
  });
};
