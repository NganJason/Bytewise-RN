import { useState } from 'react';
import { useTheme } from '@rneui/themed';
import { View, StyleSheet } from 'react-native';

import {
  BaseScreen,
  DateNavigator,
  DailyTransactions,
  AggrSummary,
  BaseScrollView,
} from '../../Components';

import {
  getUnixRangeOfMonth,
  getYear,
  getMonth,
} from '../../_shared/util/date';
import ROUTES from '../../_shared/constant/routes';
import { useGetTransactions, useAggrTransactions } from '../../_shared/query';
import { renderErrorsToast } from '../../_shared/util/toast';
import { groupTransactionsByDate } from '../../_shared/util/transaction';
import {
  TRANSACTION_TYPE_EXPENSE,
  TRANSACTION_TYPE_INCOME,
  TRANSACTION_TYPES,
} from '../../_shared/apis/enum';

const PAGING_LIMIT = 500;
const STARTING_PAGE = 1;

const TODAY = new Date();

const TransactionScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  const [activeDate, setActiveDate] = useState(TODAY);

  const [timeRange, setTimeRange] = useState(
    getUnixRangeOfMonth(getYear(activeDate), getMonth(activeDate)),
  );

  const getTransactionsQuery = useGetTransactions({
    transaction_time: {
      gte: timeRange[0],
      lte: timeRange[1],
    },
    paging: {
      limit: PAGING_LIMIT,
      page: STARTING_PAGE,
    },
  });

  const { transactionTimes = [], transactionGroups = {} } =
    groupTransactionsByDate(getTransactionsQuery.data?.transactions);

  const aggrTransactionsQuery = useAggrTransactions({
    transaction_types: [TRANSACTION_TYPE_EXPENSE, TRANSACTION_TYPE_INCOME],
    transaction_time: {
      gte: timeRange[0],
      lte: timeRange[1],
    },
  });

  const onDateMove = newDate => {
    setActiveDate(newDate);
    setTimeRange(getUnixRangeOfMonth(getYear(newDate), getMonth(newDate)));
  };

  const isScreenLoading = () =>
    getTransactionsQuery.isLoading && aggrTransactionsQuery.isLoading;

  return (
    <BaseScreen
      isLoading={isScreenLoading()}
      errorToast={renderErrorsToast([
        getTransactionsQuery,
        aggrTransactionsQuery,
      ])}
      headerProps={{
        allowBack: false,
        centerComponent: (
          <DateNavigator
            startingDate={activeDate}
            onForward={onDateMove}
            onBackward={onDateMove}
          />
        ),
      }}
      fabProps={{
        show: true,
        placement: 'right',
        iconName: 'add',
        iconColor: theme.colors.white,
        color: theme.colors.primary,
        onPress: () => navigation.navigate(ROUTES.transactionForm),
      }}>
      <View style={styles.aggrContainer}>
        <AggrSummary
          aggrs={[
            {
              label: TRANSACTION_TYPES[TRANSACTION_TYPE_INCOME],
              amount:
                aggrTransactionsQuery.data?.results?.[
                  String(TRANSACTION_TYPE_INCOME)
                ]?.sum || 0,
            },
            {
              label: TRANSACTION_TYPES[TRANSACTION_TYPE_EXPENSE],
              amount:
                -aggrTransactionsQuery.data?.results?.[
                  String(TRANSACTION_TYPE_EXPENSE)
                ]?.sum || 0,
            },
          ]}
        />
      </View>
      <BaseScrollView showsVerticalScrollIndicator={false}>
        {transactionTimes.map((tt, i) => (
          <DailyTransactions
            key={i}
            transactions={transactionGroups[tt]}
            timestamp={tt}
          />
        ))}
      </BaseScrollView>
    </BaseScreen>
  );
};

const getStyles = _ => {
  return StyleSheet.create({
    aggrContainer: {
      marginBottom: 22,
    },
  });
};

export default TransactionScreen;
