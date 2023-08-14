import { useNavigation } from '@react-navigation/native';
import { useTheme } from '@rneui/themed';
import { useContext, useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { AmountText, BaseText } from '../../Components';
import {
  TRANSACTION_TYPE_EXPENSE,
  TRANSACTION_TYPE_INCOME,
} from '../../_shared/apis/enum';
import { toolTipMessage } from '../../_shared/constant/message';
import ROUTES from '../../_shared/constant/routes';
import { BottomToastContext } from '../../_shared/context/BottomToastContext';
import { useAggrTransactions } from '../../_shared/query';
import {
  getMonth,
  getUnixRangeOfMonth,
  getYear,
} from '../../_shared/util/date';

const BreakdownOverviewScreen = ({ activeDate = new Date() }) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const navigation = useNavigation();
  const { toast } = useContext(BottomToastContext);

  const [monthRange, setMonthRange] = useState(
    getUnixRangeOfMonth(getYear(activeDate), getMonth(activeDate)),
  );
  useEffect(() => {
    setMonthRange(
      getUnixRangeOfMonth(getYear(activeDate), getMonth(activeDate)),
    );
  }, [activeDate]);

  const aggrTransactionsByTypeQuery = useAggrTransactions({
    transaction_types: [TRANSACTION_TYPE_EXPENSE, TRANSACTION_TYPE_INCOME],
    transaction_time: {
      gte: monthRange[0],
      lte: monthRange[1],
    },
  });

  const getTotalAmountByCategoryType = (type = TRANSACTION_TYPE_EXPENSE) => {
    return (
      Math.abs(aggrTransactionsByTypeQuery?.data?.results?.[type]?.sum) || 0
    );
  };

  const expenseCard = () => {
    return (
      <TouchableOpacity
        style={styles.itemContainer}
        onPress={() => {
          navigation.navigate(ROUTES.categoriesOverview, {
            category_type: TRANSACTION_TYPE_EXPENSE,
            active_date: activeDate.valueOf(),
          });
        }}>
        <BaseText text3>Expense</BaseText>
        <AmountText h2>
          {getTotalAmountByCategoryType(TRANSACTION_TYPE_EXPENSE)}
        </AmountText>
      </TouchableOpacity>
    );
  };

  const incomeCard = () => {
    return (
      <TouchableOpacity
        style={styles.itemContainer}
        onPress={() => {
          navigation.navigate(ROUTES.categoriesOverview, {
            category_type: TRANSACTION_TYPE_INCOME,
            active_date: activeDate.valueOf(),
          });
        }}>
        <BaseText text3>Income</BaseText>
        <AmountText h2>
          {getTotalAmountByCategoryType(TRANSACTION_TYPE_INCOME)}
        </AmountText>
      </TouchableOpacity>
    );
  };

  const cashFlowCard = () => {
    let cashFlow =
      getTotalAmountByCategoryType(TRANSACTION_TYPE_INCOME) -
      getTotalAmountByCategoryType(TRANSACTION_TYPE_EXPENSE);

    return (
      <TouchableOpacity
        style={styles.itemContainer}
        onPress={() => {
          toast.info(
            toolTipMessage.cashFlowDesc.text,
            toolTipMessage.cashFlowDesc.title,
          );
        }}>
        <BaseText text3>Cash Flow</BaseText>
        <AmountText h2 showNegativeOnly showColor>
          {cashFlow}
        </AmountText>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.screen}>
      {expenseCard()}
      {incomeCard()}
      {cashFlowCard()}
    </View>
  );
};

const getStyles = theme =>
  StyleSheet.create({
    screen: {
      minHeight: '100%',
    },
    itemContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '100%',
      padding: 18,
      marginTop: 30,
      backgroundColor: 'white',
      borderRadius: 10,
      shadowColor: theme.colors.black,
      shadowOffset: {
        width: 0,
        height: 3,
      },
      shadowOpacity: 0.18,
      shadowRadius: 4.59,
      elevation: 5,
    },
  });

export default BreakdownOverviewScreen;
