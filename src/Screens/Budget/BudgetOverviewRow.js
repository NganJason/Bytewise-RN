import { useNavigation } from '@react-navigation/native';
import { useTheme } from '@rneui/themed';
import { StyleSheet, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import {
  AmountText,
  BaseDivider,
  BaseLinearProgress,
  BaseText,
  IconButton,
} from '../../Components';
import {
  BUDGET_TYPE_MONTHLY,
  TRANSACTION_TYPE_EXPENSE,
} from '../../_shared/apis/enum';
import ROUTES from '../../_shared/constant/routes';
import { getProgress } from '../../_shared/util';

const BudgetOverviewRow = ({
  categoryWithBudget = {},
  activeDate = new Date(),
  isEdit = false,
  toggleEdit = function () {},
}) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const navigation = useNavigation();

  const {
    category_id: categoryID = '',
    category_name: catgoryName = '',
    budget = {},
  } = categoryWithBudget;

  const {
    used_amount: usedAmount = 0,
    amount = 0,
    budget_type: budgetType = BUDGET_TYPE_MONTHLY,
  } = budget;

  const onPress = () => {
    navigation.navigate(ROUTES.categoryBreakdown, {
      category_id: categoryID,
      active_ts: activeDate.valueOf(),
      category_type: TRANSACTION_TYPE_EXPENSE,
    });
  };

  const onEditBudget = () => {
    navigation.navigate(ROUTES.budgetForm, {
      category_id: categoryID,
      budget_type: budgetType,
      active_date: activeDate.valueOf(),
    });
    toggleEdit();
  };

  return (
    <TouchableOpacity style={styles.row} onPress={onPress} disabled={isEdit}>
      <View style={styles.rowInfo}>
        <BaseText text3>{catgoryName}</BaseText>
        {isEdit ? (
          <IconButton
            iconSize={16}
            type="clear"
            iconName="edit-2"
            iconType="feather"
            color={theme.colors.color8}
            onPress={onEditBudget}
          />
        ) : (
          <View style={styles.aggr}>
            <AmountText text4 style={{ color: theme.colors.color7 }} sensitive>
              {usedAmount}
            </AmountText>
            <BaseDivider orientation={'vertical'} margin={5} />
            <AmountText text4 style={{ color: theme.colors.color7 }} sensitive>
              {amount}
            </AmountText>
          </View>
        )}
      </View>

      <View style={styles.progress}>
        {isEdit ? (
          <BaseDivider />
        ) : (
          <BaseLinearProgress value={getProgress(usedAmount, amount)} />
        )}
      </View>
    </TouchableOpacity>
  );
};

const getStyles = _ =>
  StyleSheet.create({
    row: {
      marginBottom: 10,
      minHeight: 60,
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
