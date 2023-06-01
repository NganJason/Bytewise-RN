import { useState, useEffect } from 'react';
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
import {
  TRANSACTION_TYPE_EXPENSE,
  TRANSACTION_TYPE_INCOME,
  TRANSACTION_TYPES,
} from '../../_shared/apis/enum';

const PAGING_LIMIT = 500;
const STARTING_PAGE = 1;

const TransactionScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  const [activeDate, setActiveDate] = useState(new Date());

  const onDateChange = e => {
    setActiveDate(e);
  };

  const [timeRange, setTimeRange] = useState(
    getUnixRangeOfMonth(getYear(activeDate), getMonth(activeDate)),
  );

  useEffect(() => {
    setTimeRange(
      getUnixRangeOfMonth(getYear(activeDate), getMonth(activeDate)),
    );
  }, [activeDate]);

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

  const renderTransactions = () => {
    const transactions = {};
    getTransactionsQuery.data?.transactions.forEach(t => {
      // group by timestamp
      const tt = new Date(t.transaction_time).setHours(0, 0, 0, 0);
      transactions[tt] = [...(transactions[tt] || []), t];
    });
    return transactions;
  };

  const aggrTransactionsQuery = useAggrTransactions({
    transaction_types: [TRANSACTION_TYPE_EXPENSE, TRANSACTION_TYPE_INCOME],
    transaction_time: {
      gte: timeRange[0],
      lte: timeRange[1],
    },
  });

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
            onForward={onDateChange}
            onBackward={onDateChange}
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
                ].sum || 0,
            },
            {
              label: TRANSACTION_TYPES[TRANSACTION_TYPE_EXPENSE],
              amount:
                -aggrTransactionsQuery.data?.results?.[
                  String(TRANSACTION_TYPE_EXPENSE)
                ].sum || 0,
            },
          ]}
        />
      </View>
      <BaseScrollView showsVerticalScrollIndicator={false}>
        {Object.keys(renderTransactions())
          .sort()
          .reverse()
          .map((tt, i) => (
            <DailyTransactions
              key={i}
              transactions={renderTransactions()[tt]}
              timestamp={Number(tt)}
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
