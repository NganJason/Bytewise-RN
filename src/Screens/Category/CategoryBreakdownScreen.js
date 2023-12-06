import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useTheme } from '@rneui/themed';
import { useNavigation } from '@react-navigation/native';
import {
  BaseText,
  IconButton,
  DateNavigator,
  BaseScreenV2,
  Transactions,
  BaseLinearProgress,
  AmountText,
} from '../../Components';
import { BUDGET_TYPE_ANNUAL } from '../../_shared/apis/enum';
import ROUTES from '../../_shared/constant/routes';
import {
  TIME_RANGE_MONTHLY,
  TIME_RANGE_YEARLY,
} from '../../_shared/constant/constant';
import { useTimeRange, useError } from '../../_shared/hooks';
import { getDateStringWithoutDelim, getProgress } from '../../_shared/util';
import { useGetTransactionGroups } from '../../_shared/query';
import { useGetCategoryBudget } from '../../_shared/query/budget';
import { Amount } from '../../_shared/object';

const PAGING_LIMIT = 500;
const STARTING_PAGE = 1;
const TODAY = new Date();

const CategoryBreakdownScreen = ({ route }) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const navigation = useNavigation();

  const {
    active_ts: activeTs = TODAY.valueOf(),
    category_id: categoryID = '',
  } = route?.params || {};

  const { activeDate, timeRange, onDateMove, timeRangeType } = useTimeRange(
    new Date(activeTs),
    TIME_RANGE_MONTHLY,
  );

  const isUncategorised = () => {
    return categoryID === '';
  };

  const getCategoryBudget = useGetCategoryBudget(
    {
      budget_date: getDateStringWithoutDelim(activeDate),
      category_id: categoryID,
    },
    { enabled: !isUncategorised() },
  );

  const getTransactionGroups = useGetTransactionGroups({
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

  const renderFeedback = () => {
    let prefix,
      suffix = '';

    let amount = null;

    const remain = getCategoryBudget?.data?.category?.budget?.remain;
    const currency = getCategoryBudget?.data?.category?.budget?.currency;
    if (remain === 0) {
      prefix = 'You are out of budget';
    } else if (remain < 0) {
      prefix = 'You exceed budget by ';
      amount = (
        <AmountText showColor text5 amount={new Amount(remain, currency)} />
      );
    } else {
      prefix = 'You have ';
      amount = (
        <AmountText showColor text5 amount={new Amount(remain, currency)} />
      );
      suffix = ' left';
    }

    return (
      <View style={styles.feedback}>
        <BaseText text5>{prefix}</BaseText>
        {amount}
        <BaseText text5>{suffix}</BaseText>
      </View>
    );
  };

  const isScreenLoading = () => {
    return getCategoryBudget.isLoading || getTransactionGroups.isLoading;
  };

  useError([getTransactionGroups, getCategoryBudget]);

  const renderSubHeader = () => {
    return (
      <>
        <View style={styles.headerTitle}>
          <BaseText
            h2
            isLoading={getCategoryBudget.isLoading}
            numberOfLines={1}
            ellipsizeMode="tail">
            {isUncategorised()
              ? 'Uncategorised'
              : getCategoryBudget?.data?.category?.category_name}
          </BaseText>
          {!isUncategorised() && (
            <IconButton
              buttonSize="xs"
              iconSize={20}
              type="clear"
              iconName="edit"
              iconType="feather"
              align="flex-start"
              color={theme.colors.color8}
              onPress={onBudgetPress}
            />
          )}
        </View>
        {!isUncategorised() && (
          <View style={styles.budgetRow}>
            {renderFeedback()}
            <BaseLinearProgress
              value={getProgress(
                getCategoryBudget?.data?.category?.budget?.used_amount,
                getCategoryBudget?.data?.category?.budget?.amount,
              )}
            />
            <View style={styles.usageSummary}>
              <AmountText
                text4
                amount={
                  new Amount(
                    getCategoryBudget?.data?.category?.budget?.used_amount,
                    getCategoryBudget?.data?.category?.budget?.currency,
                  )
                }
                style={{ color: theme.colors.color7 }}
                sensitive
              />
              <AmountText
                text4
                amount={
                  new Amount(
                    getCategoryBudget?.data?.category?.budget?.amount,
                    getCategoryBudget?.data?.category?.budget?.currency,
                  )
                }
                style={{ color: theme.colors.color7 }}
                sensitive
              />
            </View>
          </View>
        )}
      </>
    );
  };

  const renderRows = () => {
    let { transaction_groups: groups = [] } = getTransactionGroups?.data || {};
    return (
      <Transactions
        transactionGroups={groups}
        showMonthLabel={
          getCategoryBudget?.data?.category?.budget?.budget_type ===
          BUDGET_TYPE_ANNUAL
        }
      />
    );
  };

  return (
    <BaseScreenV2
      isLoading={isScreenLoading()}
      backButtonProps={{ show: true }}
      subHeaderProps={{
        subHeader: !isScreenLoading() && (
          <View style={styles.subHeader}>{renderSubHeader()}</View>
        ),
      }}
      fabProps={{
        show: true,
        onPress: () =>
          navigation.navigate(ROUTES.transactionForm, {
            categoryID: categoryID,
          }),
      }}>
      <>
        <View style={styles.dateContainer}>
          <DateNavigator
            date={activeDate}
            onForward={onDateMove}
            onBackward={onDateMove}
            isYear={timeRangeType === TIME_RANGE_YEARLY}
          />
        </View>
        {renderRows()}
      </>
    </BaseScreenV2>
  );
};

const getStyles = theme => {
  return StyleSheet.create({
    headerTitle: {
      justifyContent: 'space-between',
      flexDirection: 'row',
      alignItems: 'center',
      width: '100%',
    },
    dateContainer: {
      alignItems: 'center',
      marginBottom: 16,
    },
    subHeader: {
      padding: 16,
      backgroundColor: theme.colors.white,
      shadowColor: theme.colors.black,
      shadowOffset: {
        width: 2,
        height: -5,
      },
      shadowOpacity: 0.25,
      shadowRadius: 10,
      borderRadius: 12,
    },
    usageSummary: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 8,
    },
    budgetRow: {
      marginTop: 14,
    },
    feedback: {
      marginBottom: 8,
      flexDirection: 'row',
    },
  });
};

export default CategoryBreakdownScreen;
