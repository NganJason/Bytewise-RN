import { View, StyleSheet } from 'react-native';
import { useTheme } from '@rneui/themed';

import BaseLinearProgress from '../View/BaseLinearProgress';
import BaseText from '../Text/BaseText';
import AmountText from '../Text/AmountText';

import { TouchableOpacity } from 'react-native-gesture-handler';
import { BUDGET_TYPES } from '../../_shared/apis/enum';

const BudgetUsage = ({
  budgetType = 1,
  budget = '0',
  used = '0',
  onPress = function () {},
}) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  return (
    <TouchableOpacity onPress={onPress}>
      <View style={[styles.text, styles.topText]}>
        <BaseText h4>{`${BUDGET_TYPES[budgetType]}`} Budget</BaseText>
        <View style={styles.topRightText}>
          <AmountText>{budget - used}</AmountText>
          <BaseText> left</BaseText>
        </View>
      </View>
      <BaseLinearProgress value={0.4} />
      <View style={[styles.text, styles.bottomText]}>
        <AmountText>{used}</AmountText>
        <BaseText> of </BaseText>
        <AmountText>{budget}</AmountText>
      </View>
    </TouchableOpacity>
  );
};

export default BudgetUsage;

const getStyles = _ =>
  StyleSheet.create({
    text: {
      width: '100%',
      flexDirection: 'row',
    },
    topText: {
      justifyContent: 'space-between',
      marginBottom: 12,
    },
    bottomText: {
      marginTop: 12,
    },
    topRightText: {
      flexDirection: 'row',
    },
  });
