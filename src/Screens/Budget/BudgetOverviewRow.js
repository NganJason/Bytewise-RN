import { useNavigation } from '@react-navigation/native';
import { useTheme } from '@rneui/themed';
import { StyleSheet, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import {
  AmountText,
  BaseDivider,
  BaseLinearProgress,
  BaseText,
} from '../../Components';
import ROUTES from '../../_shared/constant/routes';
import { getProgress } from '../../_shared/util/common';
import { capitalize } from '../../_shared/util/string';

const BudgetOverviewRow = ({ categoryWithBudget }) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const navigation = useNavigation();

  const {
    category_id: categoryID = '',
    category_name: catgoryName = '',
    budget = {},
  } = categoryWithBudget || {};

  const { used_amount: usedAmount = 0, amount = 0 } = budget;

  const onPress = () => {
    navigation.navigate(ROUTES.categoryBreakdown, { category_id: categoryID });
  };

  return (
    <TouchableOpacity style={styles.row} onPress={onPress}>
      <View style={styles.rowInfo}>
        <BaseText text3>{capitalize(catgoryName)}</BaseText>
        <View style={styles.aggr}>
          <AmountText text4 decimal={0} style={{ color: theme.colors.color7 }}>
            {usedAmount}
          </AmountText>
          <BaseDivider orientation={'vertical'} margin={5} />
          <AmountText text4 decimal={0} style={{ color: theme.colors.color7 }}>
            {amount}
          </AmountText>
        </View>
      </View>

      <View style={styles.progress}>
        <BaseLinearProgress value={getProgress(usedAmount, amount)} />
      </View>
    </TouchableOpacity>
  );
};

const getStyles = _ =>
  StyleSheet.create({
    row: {
      marginBottom: 10,
    },
    rowInfo: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    aggr: {
      flexDirection: 'row',
    },
    progress: {
      marginTop: 16,
      marginBottom: 20,
    },
  });

export default BudgetOverviewRow;
