import { useContext } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { useTheme } from '@rneui/themed';
import { useNavigation } from '@react-navigation/native';

import { TRANSACTION_TYPE_EXPENSE } from '../../_shared/apis/enum';
import { BaseText, AmountText, BaseLinearProgress } from '../../Components';
import ROUTES from '../../_shared/constant/routes';
import { UserMetaContext } from '../../_shared/context/UserMetaContext';
import { Amount } from '../../_shared/object';
import { getProgress } from '../../_shared/util';

const BudgetRowV2 = ({ categoryWithBudget = {}, activeDate = new Date() }) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const navigation = useNavigation();
  const { getUserBaseCurrency } = useContext(UserMetaContext);

  const {
    category_id: categoryID = '',
    category_name: catgoryName = '',
    budget = {},
  } = categoryWithBudget;

  const {
    used_amount: usedAmount = 0,
    amount = 0,
    currency = getUserBaseCurrency(),
  } = budget;

  const onPress = () => {
    navigation.navigate(ROUTES.categoryBreakdown, {
      category_id: categoryID,
      active_ts: activeDate.valueOf(),
      category_type: TRANSACTION_TYPE_EXPENSE,
    });
  };

  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.rowInfo}>
        <BaseText text3>{catgoryName}</BaseText>
      </View>
      <BaseLinearProgress value={getProgress(usedAmount, amount)} />
      <View style={styles.usageSummary}>
        <AmountText
          text4
          amount={new Amount(usedAmount, currency)}
          style={{ color: theme.colors.color7 }}
          sensitive
        />
        <AmountText
          text4
          amount={new Amount(amount, currency)}
          style={{ color: theme.colors.color7 }}
          sensitive
        />
      </View>
    </TouchableOpacity>
  );
};

const getStyles = _ =>
  StyleSheet.create({
    rowInfo: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 8,
    },
    usageSummary: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 8,
    },
  });

export default BudgetRowV2;
