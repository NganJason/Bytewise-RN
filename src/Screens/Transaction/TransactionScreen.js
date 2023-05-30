import { useState, useEffect } from 'react';
import { useTheme } from '@rneui/themed';

import {
  BaseScreen,
  DateNavigator,
  DailyTransactions,
  AggrSummary,
  BaseScrollView,
} from '../../Components';

import ROUTES from '../../_shared/constant/routes';
import { useGetTransactions } from '../../_shared/query';
import {
  getUnixRangeOfMonth,
  getYear,
  getMonth,
} from '../../_shared/util/date';
import { renderErrorsToast } from '../../_shared/util/toast';

const PAGING_LIMIT = 500;
const STARTING_PAGE = 1;

const TransactionScreen = ({ navigation }) => {
  const { theme } = useTheme();

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

  return (
    <BaseScreen
      isLoading={getTransactionsQuery.isLoading}
      errorToast={renderErrorsToast([getTransactionsQuery])}
      headerProps={{
        allowBack: false,
        centerComponent: (
          <>
            <DateNavigator
              startingDate={activeDate}
              onForward={onDateChange}
              onBackward={onDateChange}
            />
            <AggrSummary
              aggrs={[
                { label: 'Income', amount: '100' },
                { label: 'Expense', amount: '-200' },
              ]}
            />
          </>
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

export default TransactionScreen;
