import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '@rneui/themed';
import { useNavigation } from '@react-navigation/native';

import BaseText from '../Text/BaseText';
import AmountText from '../Text/AmountText';

import ROUTES from '../../_shared/constant/routes';

const Category = ({ category: { cat_name = '' }, amount = '' }) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      style={styles.categoryContainer}
      onPress={() => {
        navigation.navigate(ROUTES.categoryBreakdown, {
          budget: {
            category: { cat_name: cat_name },
            amount: amount,
          },
        });
      }}>
      <View style={styles.textGroup}>
        <BaseText h4>{cat_name}</BaseText>
        <AmountText h4 showColor={false}>
          {amount}
        </AmountText>
      </View>
    </TouchableOpacity>
  );
};

export default Category;

const getStyles = _ => {
  return StyleSheet.create({
    categoryContainer: {
      width: '100%',
    },
    textGroup: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
  });
};
