import { useState } from 'react';
import { useTheme } from '@rneui/themed';
import { View, StyleSheet } from 'react-native';
import {
  BaseScreen,
  DateNavigator,
  AggrSummary,
  BaseLoadableView,
  Transactions,
  IconButton,
} from '../../Components';
import { getUnixRangeOfMonth, getYear, getMonth } from '../../_shared/util';
import ROUTES from '../../_shared/constant/routes';
import {
  useGetTransactionGroups,
  useSumTransactions,
} from '../../_shared/query';
import {
  TRANSACTION_TYPE_EXPENSE,
  TRANSACTION_TYPE_INCOME,
  TRANSACTION_TYPES,
} from '../../_shared/apis/enum';
import { useError, useDimension } from '../../_shared/hooks';
import { EmptyContentConfig } from '../../_shared/constant/constant';
import { Amount } from '../../_shared/object';

const PAGING_LIMIT = 500;
const STARTING_PAGE = 1;

const TODAY = new Date();

const TransactionScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const { screenHeight } = useDimension();
  const styles = getStyles(theme, screenHeight);

  const [activeDate, setActiveDate] = useState(TODAY);
  const [timeRange, setTimeRange] = useState(
    getUnixRangeOfMonth(getYear(activeDate), getMonth(activeDate)),
  );

  const getTransactionGroups = useGetTransactionGroups(
    {
      transaction_time: {
        gte: timeRange[0],
        lte: timeRange[1],
      },
      paging: {
        limit: PAGING_LIMIT,
        page: STARTING_PAGE,
      },
    },
    {},
  );

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

  const onDateMove = newDate => {
    setActiveDate(newDate);
    setTimeRange(getUnixRangeOfMonth(getYear(newDate), getMonth(newDate)));
  };

  const isScreenLoading = () =>
    getTransactionGroups.isLoading || sumTransactionsQuery.isLoading;

  const renderRows = () => {
    let { transaction_groups: groups = [] } = getTransactionGroups?.data || {};
    return (
      <Transactions
        transactionGroups={groups}
        emptyContentConfig={EmptyContentConfig.transactionv2}
      />
    );
  };

  useError([getTransactionGroups, sumTransactionsQuery]);

  return (
    <BaseScreen
      allowLoadable={false}
      backgroundColor={theme.colors.color11}
      enablePadding={false}
      headerProps={{
        allowBack: false,
        allowDrawer: true,
        rightComponent: (
          <IconButton
            iconName="calendar"
            iconType="font-awesome"
            iconSize={22}
            onPress={() => navigation.navigate(ROUTES.transactionCalendar)}
            color={theme.colors.color7}
          />
        ),
        centerComponent: (
          <DateNavigator
            date={activeDate}
            onForward={onDateMove}
            onBackward={onDateMove}
            enablePicker
          />
        ),
      }}
      fabProps={{
        show: true,
        placement: 'right',
        iconName: 'plus',
        iconType: 'entypo',
        iconColor: theme.colors.white,
        color: theme.colors.color1,
        onPress: () => navigation.navigate(ROUTES.transactionForm),
      }}>
      <View style={styles.aggrContainer}>
        <AggrSummary
          aggrs={[
            {
              label: TRANSACTION_TYPES[TRANSACTION_TYPE_INCOME],
              amount: getTransactionsSum(TRANSACTION_TYPE_INCOME),
              sensitive: true,
            },
            {
              label: TRANSACTION_TYPES[TRANSACTION_TYPE_EXPENSE],
              amount: getTransactionsSum(TRANSACTION_TYPE_EXPENSE),
              sensitive: true,
            },
          ]}
        />
      </View>
      <View style={styles.body}>
        <BaseLoadableView scrollable={true} isLoading={isScreenLoading()}>
          {renderRows()}
        </BaseLoadableView>
      </View>
    </BaseScreen>
  );
};

const getStyles = theme => {
  return StyleSheet.create({
    aggrContainer: {
      marginBottom: 22,
    },
    body: {
      flex: 1,
      padding: theme.spacing.xl,
      backgroundColor: theme.colors.white,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      shadowColor: theme.colors.black,
      shadowOffset: {
        width: 2,
        height: -5,
      },
      shadowOpacity: 0.2,
      shadowRadius: 10,
      elevation: 10,
    },
  });
};

export default TransactionScreen;
