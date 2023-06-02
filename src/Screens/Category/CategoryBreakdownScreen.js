import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTheme } from '@rneui/themed';
import { useNavigation } from '@react-navigation/native';
import {
  BaseText,
  BaseScreen,
  DailyTransactions,
  IconButton,
  BaseScrollView,
  DateNavigator,
  AggrSummary,
} from '../../Components';

import {
  useAggrTransactions,
  useGetTransactions,
  useGetCategory,
} from '../../_shared/query';
import {
  getUnixRangeOfMonth,
  getYear,
  getMonth,
} from '../../_shared/util/date';
import {
  TRANSACTION_TYPE_EXPENSE,
  TRANSACTION_TYPE_INCOME,
} from '../../_shared/apis/enum';
import { groupTransactionsByDate } from '../../_shared/util/transaction';
import { renderErrorsToast } from '../../_shared/util/toast';
import ROUTES from '../../_shared/constant/routes';

const PAGING_LIMIT = 500;
const STARTING_PAGE = 1;

const TODAY = new Date();

const CategoryBreakdownScreen = ({ route }) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const navigation = useNavigation();

  // cannot pass date object as param
  const activeTimestamp = route.params?.active_timestamp || TODAY.valueOf();
  const [activeDate, setActiveDate] = useState(new Date(activeTimestamp));

  const categoryID = route.params?.category_id || '';
  const getCategory = useGetCategory({ category_id: categoryID });

  const [timeRange, setTimeRange] = useState(
    getUnixRangeOfMonth(getYear(activeDate), getMonth(activeDate)),
  );

  const getTransactionsQuery = useGetTransactions({
    category_id: categoryID,
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
    category_ids: [categoryID],
    transaction_time: {
      gte: timeRange[0],
      lte: timeRange[1],
    },
  });

  const onDateMove = newDate => {
    setActiveDate(newDate);
    setTimeRange(getUnixRangeOfMonth(getYear(newDate), getMonth(newDate)));
  };

  const renderAggrSummaryByType = () => {
    if (getCategory.data?.category.category_type === TRANSACTION_TYPE_EXPENSE) {
      return [
        {
          label: 'Budget',
          amount: 0,
        },
        {
          label: 'Used',
          amount: -aggrTransactionsQuery.data?.results?.[categoryID].sum || 0,
        },
      ];
    }

    if (getCategory.data?.category.category_type === TRANSACTION_TYPE_INCOME) {
      return [
        {
          label: 'Total',
          amount: aggrTransactionsQuery.data?.results?.[categoryID].sum || 0,
        },
      ];
    }

    return [];
  };

  const isScreenLoading = () =>
    getCategory.isLoading ||
    getTransactionsQuery.isLoading ||
    aggrTransactionsQuery.isLoading;

  return (
    <BaseScreen
      isLoading={isScreenLoading()}
      errorToast={renderErrorsToast([
        getCategory,
        getTransactionsQuery,
        aggrTransactionsQuery,
      ])}
      headerProps={{
        allowBack: true,
        centerComponent: (
          <>
            <BaseText h1 style={styles.categoryNameText}>
              {getCategory.data?.category.category_name}
            </BaseText>
            <DateNavigator
              startingDate={activeDate}
              onForward={onDateMove}
              onBackward={onDateMove}
            />
          </>
        ),
        rightComponent: (
          <IconButton
            buttonSize="xs"
            type="clear"
            iconName="edit"
            iconType="fontawesome"
            align="left"
            onPress={() => {
              navigation.navigate(ROUTES.categoryForm, {
                category_id: categoryID,
              });
            }}
          />
        ),
      }}>
      <View style={styles.aggrContainer}>
        <AggrSummary aggrs={renderAggrSummaryByType()} />
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

const getStyles = theme => {
  return StyleSheet.create({
    aggrContainer: {
      marginBottom: 22,
    },
    categoryNameText: {
      marginBottom: 4,
      color: theme.colors.color1,
    },
  });
};

export default CategoryBreakdownScreen;
