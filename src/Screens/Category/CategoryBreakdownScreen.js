import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTheme } from '@rneui/themed';
import { useNavigation } from '@react-navigation/native';
import {
  BaseText,
  DailyTransactions,
  IconButton,
  DateNavigator,
  BaseDivider,
  AmountText,
  BaseScreen3,
  BaseLinearProgress,
  BaseLoadableView,
} from '../../Components';

import { useAggrTransactions, useGetCategory } from '../../_shared/query';
import {
  getUnixRangeOfMonth,
  getYear,
  getMonth,
} from '../../_shared/util/date';
import { TRANSACTION_TYPE_EXPENSE } from '../../_shared/apis/enum';
import { groupTransactionsByDate } from '../../_shared/util/transaction';
import ROUTES from '../../_shared/constant/routes';
import { EmptyContent } from '../../Components/Common';
import { EmptyContentConfig } from '../../_shared/constant/constant';
import { useGetTransactionsHook } from '../../_shared/hooks/transaction';
import { useError } from '../../_shared/hooks/error';
import { TouchableOpacity } from 'react-native-gesture-handler';

const PAGING_LIMIT = 500;
const STARTING_PAGE = 1;

const TODAY = new Date();

const CategoryBreakdownScreen = ({ route }) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const navigation = useNavigation();

  const {
    active_timestamp: activeTimestamp = TODAY.valueOf(),
    // category_id: categoryID = '64b9cae6da15f96cd5566439',
    category_type: categoryType = TRANSACTION_TYPE_EXPENSE,
  } = route?.params || {};

  let categoryID = '64c04c9ed66ff3c175c0c6f6';
  const [activeDate, setActiveDate] = useState(new Date(activeTimestamp));
  const [timeRange, setTimeRange] = useState(
    getUnixRangeOfMonth(getYear(activeDate), getMonth(activeDate)),
  );

  const getCategory = useGetCategory({ category_id: categoryID });

  const getTransactions = useGetTransactionsHook({
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

  const renderRows = () => {
    let rows = [];
    let { transactions = [] } = getTransactions;
    const { transactionTimes = [], transactionGroups = {} } =
      groupTransactionsByDate(transactions);

    transactionTimes.map((tt, i) =>
      rows.push(
        <DailyTransactions
          key={i}
          transactions={transactionGroups[tt]}
          timestamp={tt}
        />,
      ),
    );

    if (rows.length === 0 && !getTransactions.isLoading) {
      return (
        <EmptyContent
          item={EmptyContentConfig.transaction}
          route={ROUTES.transactionForm}
          marginVertical="30%"
        />
      );
    }

    return rows;
  };

  const onBudgetPress = () => {
    navigation.navigate(ROUTES.budgetForm, {
      category_id: categoryID,
    });
  };

  const isScreenLoading = () =>
    getCategory.isLoading ||
    getTransactions.isLoading ||
    aggrTransactionsQuery.isLoading;

  useError([getCategory, getTransactions, aggrTransactionsQuery]);

  const renderHeader = () => {
    return (
      <>
        <View style={styles.headerTitle}>
          <BaseText h2 isLoading={getCategory.isLoading}>
            {getCategory.data?.category.category_name}
          </BaseText>
          <IconButton
            buttonSize="xs"
            iconSize={20}
            type="clear"
            iconName="settings"
            iconType="feather"
            align="flex-start"
            color={theme.colors.color8}
            onPress={() => {
              navigation.navigate(ROUTES.categoryForm, {
                category_id: categoryID,
              });
            }}
          />
        </View>

        <BaseText
          text4
          margin={{ top: 14, bottom: 8 }}
          isLoading={getCategory.isLoading}>
          Used
        </BaseText>
        <TouchableOpacity onPress={onBudgetPress}>
          <View style={styles.headerAggr}>
            <AmountText h4 isLoading={getCategory.isLoading}>
              {aggrTransactionsQuery.data?.results?.[categoryID].sum || 0}
            </AmountText>
            <BaseDivider orientation="vertical" margin={6} />
            <AmountText h4 isLoading={getCategory.isLoading}>
              200
            </AmountText>
          </View>
          <BaseLinearProgress value={0.3} />
        </TouchableOpacity>
      </>
    );
  };

  return (
    <BaseScreen3
      headerProps={{
        allowBack: true,
        component: renderHeader(),
      }}>
      <>
        <View style={styles.dateContainer}>
          <DateNavigator
            startingDate={activeDate}
            onForward={onDateMove}
            onBackward={onDateMove}
          />
        </View>

        <BaseLoadableView scrollable={true} isLoading={isScreenLoading()}>
          {renderRows()}
        </BaseLoadableView>
      </>
    </BaseScreen3>
  );
};

const getStyles = _ => {
  return StyleSheet.create({
    headerTitle: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '100%',
    },
    headerAggr: {
      flexDirection: 'row',
      marginBottom: 16,
    },
    dateContainer: {
      alignItems: 'center',
      marginBottom: 16,
    },
  });
};

export default CategoryBreakdownScreen;
