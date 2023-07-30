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
  BaseDivider,
  AmountText,
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

  const isScreenLoading = () =>
    getCategory.isLoading ||
    getTransactions.isLoading ||
    aggrTransactionsQuery.isLoading;

  useError([getCategory, getTransactions, aggrTransactionsQuery]);

  return (
    <BaseScreen
      isLoading={isScreenLoading()}
      headerProps={{
        allowBack: true,
        centerComponent: (
          <>
            <BaseText
              h2
              style={styles.categoryNameText}
              isLoading={getCategory.isLoading}>
              {getCategory.data?.category.category_name}
            </BaseText>
            <DateNavigator
              startingDate={activeDate}
              onForward={onDateMove}
              onBackward={onDateMove}
            />
            <View style={styles.aggr}>
              <BaseText text3 style={styles.categoryNameText}>
                {categoryType === TRANSACTION_TYPE_EXPENSE
                  ? 'Used: '
                  : 'Total: '}
              </BaseText>
              <AmountText>
                {aggrTransactionsQuery.data?.results?.[categoryID].sum || 0}
              </AmountText>
            </View>
          </>
        ),
        rightComponent: (
          <IconButton
            buttonSize="xs"
            iconSize={22}
            type="clear"
            iconName="edit"
            iconType="feather"
            align="flex-start"
            color={theme.colors.color1}
            onPress={() => {
              navigation.navigate(ROUTES.categoryForm, {
                category_id: categoryID,
              });
            }}
          />
        ),
      }}>
      <BaseDivider margin={20} />
      <BaseScrollView showsVerticalScrollIndicator={false}>
        {renderRows()}
      </BaseScrollView>
    </BaseScreen>
  );
};

const getStyles = theme => {
  return StyleSheet.create({
    aggr: { alignSelf: 'center', flexDirection: 'row' },
    categoryNameText: {
      marginBottom: 4,
    },
  });
};

export default CategoryBreakdownScreen;
