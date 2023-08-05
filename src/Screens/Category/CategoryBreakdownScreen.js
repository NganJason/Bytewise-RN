import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Icon, useTheme } from '@rneui/themed';
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
  BaseButton,
} from '../../Components';
import {
  TRANSACTION_TYPE_EXPENSE,
  TRANSACTION_TYPE_INCOME,
} from '../../_shared/apis/enum';
import { groupTransactionsByDate } from '../../_shared/util/transaction';
import ROUTES from '../../_shared/constant/routes';
import { EmptyContent } from '../../Components/Common';
import { EmptyContentConfig } from '../../_shared/constant/constant';
import { useGetTransactionsHook, useTimeRange } from '../../_shared/hooks';
import { useError } from '../../_shared/hooks/error';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useGetCategoriesHelper } from '../../_shared/hooks';
import { getProgress } from '../../_shared/util/common';
import { useAggrTransactions } from '../../_shared/query';

const PAGING_LIMIT = 500;
const STARTING_PAGE = 1;
const TODAY = new Date();

const CategoryBreakdownScreen = ({ route }) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const navigation = useNavigation();

  const {
    active_timestamp: activeTimestamp = TODAY.valueOf(),
    category_id: categoryID = '',
  } = route?.params || {};

  const { activeDate, timeRange, onDateMove } = useTimeRange(
    new Date(activeTimestamp),
  );

  const {
    categoryIDToCategoryMap,
    isLoading: isCategoryBudgetLoading,
    getQueries,
  } = useGetCategoriesHelper({
    budgetDate: activeDate,
  });
  const {
    category_name: categoryName = '',
    category_type: categoryType = TRANSACTION_TYPE_EXPENSE,
    budget = null,
  } = categoryIDToCategoryMap[categoryID] || {};
  const { amount: budgetAmount = 0 } = budget || {};

  const aggrTransactionsQuery = useAggrTransactions({
    category_ids: [categoryID],
    transaction_time: {
      gte: timeRange[0],
      lte: timeRange[1],
    },
  });
  const getCategoryUsedAmount = () => {
    return aggrTransactionsQuery.data?.results?.[categoryID].sum || 0;
  };

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

  const onBudgetPress = () => {
    navigation.navigate(ROUTES.budgetForm, {
      category_id: categoryID,
      active_date: activeDate.valueOf(),
    });
  };

  const isScreenLoading = () => {
    return (
      isCategoryBudgetLoading() ||
      getTransactions.isLoading ||
      aggrTransactionsQuery.isLoading
    );
  };

  useError([...getQueries(), getTransactions, aggrTransactionsQuery]);

  const renderHeader = () => {
    const noBudgetAggr = () => {
      return (
        <>
          <BaseText
            text4
            margin={{ top: 14, bottom: 8 }}
            isLoading={isCategoryBudgetLoading()}>
            Used
          </BaseText>
          <AmountText h4 isLoading={isCategoryBudgetLoading()}>
            {getCategoryUsedAmount()}
          </AmountText>
          <BaseButton
            title="Add budget"
            type="clear"
            align="flex-start"
            size="sm"
            icon={
              <Icon
                name="plus-circle"
                type="feather"
                color={theme.colors.color1}
                size={13}
              />
            }
            onPress={onBudgetPress}
          />
        </>
      );
    };

    const budgetAggr = () => {
      return (
        <>
          <BaseText
            text4
            margin={{ top: 14, bottom: 8 }}
            isLoading={isCategoryBudgetLoading()}>
            Used
          </BaseText>
          <TouchableOpacity onPress={onBudgetPress}>
            <View style={styles.headerAggr}>
              <AmountText h4 isLoading={isCategoryBudgetLoading()}>
                {getCategoryUsedAmount()}
              </AmountText>
              <BaseDivider orientation="vertical" margin={6} />
              <AmountText h4 isLoading={isCategoryBudgetLoading()}>
                {budgetAmount}
              </AmountText>
            </View>
            <BaseLinearProgress
              value={getProgress(budget.used_amount, budget.amount)}
              showPercentage
            />
          </TouchableOpacity>
        </>
      );
    };

    const incomeAggr = () => {
      return (
        <>
          <BaseText
            text4
            margin={{ top: 14, bottom: 8 }}
            isLoading={isCategoryBudgetLoading()}>
            Total
          </BaseText>
          <AmountText h4 isLoading={isCategoryBudgetLoading()}>
            {getCategoryUsedAmount()}
          </AmountText>
        </>
      );
    };

    const getAggr = () => {
      if (categoryType === TRANSACTION_TYPE_INCOME) {
        return incomeAggr();
      }
      if (budget === null) {
        return noBudgetAggr();
      }
      return budgetAggr();
    };

    return (
      <>
        <View style={styles.headerTitle}>
          <BaseText h2 isLoading={isCategoryBudgetLoading()}>
            {categoryName}
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
        {getAggr()}
      </>
    );
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
