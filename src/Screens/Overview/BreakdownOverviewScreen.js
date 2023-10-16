import { useNavigation } from '@react-navigation/native';
import { useTheme } from '@rneui/themed';
import { useContext } from 'react';
import { View, StyleSheet } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { AmountText, BaseBottomSelectTab, BaseText } from '../../Components';
import {
  TRANSACTION_TYPE_EXPENSE,
  TRANSACTION_TYPE_INCOME,
} from '../../_shared/apis/enum';
import {
  TIME_RANGE_MONTHLY,
  TIME_RANGE_TYPES,
  TIME_RANGE_YEARLY,
} from '../../_shared/constant/constant';
import { toolTipMessage } from '../../_shared/constant/message';
import ROUTES from '../../_shared/constant/routes';
import { BottomToastContext } from '../../_shared/context';
import { Amount } from '../../_shared/object';
import { useSumTransactions } from '../../_shared/query';

const BreakdownOverviewScreen = ({
  activeTs = new Date().valueOf(),
  timeRange = [],
  timeRangeType = TIME_RANGE_MONTHLY,
  setTimeRangeType = function () {},
}) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const navigation = useNavigation();
  const { toast } = useContext(BottomToastContext);

  const sumTransactionsQuery = useSumTransactions({
    transaction_time: {
      gte: timeRange[0],
      lte: timeRange[1],
    },
  });

  const getTransactionsSum = (transactionType = 0) => {
    const { sums = [] } = sumTransactionsQuery?.data || [];

    for (const sum of sums) {
      if (sum.transaction_type === transactionType) {
        return new Amount(sum.sum, sum.currency);
      }
    }

    return new Amount();
  };

  const expenseCard = () => {
    return (
      <TouchableOpacity
        style={styles.itemContainer}
        onPress={() => {
          navigation.navigate(ROUTES.categoriesOverview, {
            category_type: TRANSACTION_TYPE_EXPENSE,
            active_date: activeTs,
            defaultTimeRangeType: timeRangeType,
          });
        }}>
        <BaseText text3>Expense</BaseText>
        <AmountText
          h2
          amount={getTransactionsSum(TRANSACTION_TYPE_EXPENSE)}
          sensitive
        />
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
            active_date: activeTs,
            defaultTimeRangeType: timeRangeType,
          });
        }}>
        <BaseText text3>Income</BaseText>
        <AmountText
          h2
          amount={getTransactionsSum(TRANSACTION_TYPE_INCOME)}
          sensitive
        />
      </TouchableOpacity>
    );
  };

  const cashFlowCard = () => {
    let expense = getTransactionsSum(TRANSACTION_TYPE_EXPENSE);
    let income = getTransactionsSum(TRANSACTION_TYPE_INCOME);
    let cashFlow = income.getAmount() + expense.getAmount();

    return (
      <TouchableOpacity
        style={styles.itemContainer}
        onPress={() => {
          toast.info(
            toolTipMessage.cashFlowDesc.message,
            toolTipMessage.cashFlowDesc.title,
          );
        }}>
        <BaseText text3>Cash Flow</BaseText>
        <AmountText
          h2
          amount={new Amount(cashFlow, expense.getCurrency())}
          showNegativeOnly
          showColor
          sensitive
        />
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.screen}>
      <View style={styles.bottomSelectTab}>
        <BaseBottomSelectTab
          currTabText={TIME_RANGE_TYPES[timeRangeType][0]}
          items={[
            { name: 'Monthly', value: TIME_RANGE_MONTHLY },
            { name: 'Yearly', value: TIME_RANGE_YEARLY },
          ]}
          onSelect={e => setTimeRangeType(e.value)}
        />
      </View>
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
    bottomSelectTab: {
      alignItems: 'flex-end',
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
