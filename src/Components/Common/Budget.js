import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '@rneui/themed';
import { useNavigation } from '@react-navigation/native';

import BaseText from '../Text/BaseText';
import AmountText from '../Text/AmountText';
import BaseLinearProgress from '../View/BaseLinearProgress';

import ROUTES from '../../_shared/constant/routes';

const Budget = ({
  budget: {
    category: { cat_name = '' },
    amount = '',
    used = '',
  },
}) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      style={styles.budgetContainer}
      onPress={() => {
        navigation.navigate(ROUTES.budgetBreakdown);
      }}>
      <View style={styles.textGroup}>
        <BaseText h4>{cat_name}</BaseText>
        <AmountText h4 showColor={false}>
          {amount - used}
        </AmountText>
      </View>
      <BaseLinearProgress value={used / amount} />
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
