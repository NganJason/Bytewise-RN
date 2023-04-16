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
        navigation.navigate(ROUTES.budgetBreakdown, {
          budget: {
            category: { cat_name: cat_name },
            amount: amount,
            used: used,
          },
        });
      }}>
      <View style={styles.textGroup}>
        <BaseText h4>{cat_name}</BaseText>
        <BaseText h4>
          <AmountText h4 showColor={false}>
            {amount - used}
          </AmountText>{' '}
          left
        </BaseText>
      </View>
      <BaseLinearProgress style={styles.progressBar} value={used / amount} />
      <BaseText h5>
        <AmountText h5>{used}</AmountText> of{' '}
        <AmountText h5>{amount}</AmountText>
      </BaseText>
    </TouchableOpacity>
  );
};

export default Budget;

const getStyles = theme => {
  return StyleSheet.create({
    budgetContainer: {
      width: '100%',
    },
    progressBar: {
      marginBottom: theme.spacing.lg,
    },
    textGroup: {
      flexDirection: 'row',
      marginBottom: 12,
      justifyContent: 'space-between',
    },
  });
};
