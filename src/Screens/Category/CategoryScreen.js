import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '@rneui/themed';

import {
  BaseScreen,
  DateNavigator,
  BaseAccordion,
  BaseScrollView,
  BaseText,
  AmountText,
  BaseButton,
} from '../../Components';

import {
  TRANSACTION_TYPE_EXPENSE,
  TRANSACTION_TYPE_INCOME,
  TRANSACTION_TYPES,
} from '../../_shared/apis/enum';
import {
  getUnixRangeOfMonth,
  getYear,
  getMonth,
} from '../../_shared/util/date';
import ROUTES from '../../_shared/constant/routes';
import { useGetCategories } from '../../_shared/query';
import { renderErrorsToast } from '../../_shared/util/toast';
import { useAggrTransactions } from '../../_shared/query';

const TODAY = new Date();

const CategoryScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  const [activeDate, setActiveDate] = useState(TODAY);

  const [timeRange, setTimeRange] = useState(
    getUnixRangeOfMonth(getYear(activeDate), getMonth(activeDate)),
  );

  const [isIncomeExpanded, setIsIncomeExpanded] = useState(false);
  const [isExpenseExpanded, setIsExpenseExpanded] = useState(true);

  const getCategoriesQuery = useGetCategories({});

  const toggleIncome = () => {
    setIsIncomeExpanded(!isIncomeExpanded);
  };

  const toggleExpense = () => {
    setIsExpenseExpanded(!isExpenseExpanded);
  };

  const renderCategories = categoryType => {
    const comps = [];

    getCategoriesQuery.data?.categories?.forEach(category => {
      if (category.category_type === categoryType) {
        const sum =
          aggrTransactionsByCategoryQuery.data?.results?.[category.category_id]
            ?.sum;

        comps.push(
          <TouchableOpacity
            style={styles.categoryContainer}
            onPress={() => {
              navigation.navigate(ROUTES.categoryBreakdown, {
                category_id: category.category_id,
                active_timestamp: activeDate.valueOf(), // pass unix as date object is not serializable
              });
            }}>
            <View style={styles.categoryTextGroup}>
              <BaseText h4>{category.category_name}</BaseText>
              <AmountText h4>{sum}</AmountText>
            </View>
          </TouchableOpacity>,
        );
      }
    });

    return comps;
  };

  const aggrTransactionsByTypeQuery = useAggrTransactions({
    transaction_types: [TRANSACTION_TYPE_EXPENSE, TRANSACTION_TYPE_INCOME],
    transaction_time: {
      gte: timeRange[0],
      lte: timeRange[1],
    },
  });

  const aggrTransactionsByCategoryQuery = useAggrTransactions(
    {
      category_ids: getCategoriesQuery.data?.categories?.map(
        category => category.category_id,
      ),
      transaction_time: {
        gte: timeRange[0],
        lte: timeRange[1],
      },
    },
    {
      enabled:
        (!getCategoriesQuery.isLoading &&
          !getCategoriesQuery.isError &&
          getCategoriesQuery.data?.categories?.length !== 0) ||
        false,
    },
  );

  const onDateMove = newDate => {
    setActiveDate(newDate);
    setTimeRange(getUnixRangeOfMonth(getYear(newDate), getMonth(newDate)));
  };

  const isScreenLoading = () => {
    return (
      getCategoriesQuery.isLoading ||
      aggrTransactionsByTypeQuery.isLoading ||
      aggrTransactionsByCategoryQuery.isLoading
    );
  };

  return (
    <BaseScreen
      isLoading={isScreenLoading()}
      errorToast={renderErrorsToast([
        getCategoriesQuery,
        aggrTransactionsByTypeQuery,
        aggrTransactionsByCategoryQuery,
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
        onPress: () => navigation.navigate(ROUTES.categoryForm),
      }}>
      <>
        <View style={styles.buttonContainer}>
          <BaseButton
            onPress={() => navigation.navigate(ROUTES.budgetList)}
            title="Manage Budget"
            type="clear"
            align="flex-end"
            size="sm"
          />
        </View>
        <BaseScrollView showsVerticalScrollIndicator={false}>
          <BaseAccordion
            isExpanded={isIncomeExpanded}
            onPress={toggleIncome}
            title={
              <View style={styles.accordionTitle}>
                <BaseText h3>
                  {TRANSACTION_TYPES[TRANSACTION_TYPE_INCOME]}
                </BaseText>
                <AmountText showColor>
                  {aggrTransactionsByTypeQuery.data?.results?.[
                    String(TRANSACTION_TYPE_INCOME)
                  ]?.sum || 0}
                </AmountText>
              </View>
            }
            titleColor={theme.colors.color4}
            items={renderCategories(TRANSACTION_TYPE_INCOME)}
          />
          <BaseAccordion
            isExpanded={isExpenseExpanded}
            onPress={toggleExpense}
            title={
              <View style={styles.accordionTitle}>
                <BaseText h3>
                  {TRANSACTION_TYPES[TRANSACTION_TYPE_EXPENSE]}
                </BaseText>
                <AmountText showColor>
                  {-aggrTransactionsByTypeQuery.data?.results?.[
                    String(TRANSACTION_TYPE_EXPENSE)
                  ]?.sum || 0}
                </AmountText>
              </View>
            }
            titleColor={theme.colors.color4}
            items={renderCategories(TRANSACTION_TYPE_EXPENSE)}
          />
        </BaseScrollView>
      </>
    </BaseScreen>
  );
};

export default CategoryScreen;

const getStyles = _ =>
  StyleSheet.create({
    accordionTitle: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '100%',
    },
    buttonContainer: {
      marginBottom: 10,
    },
    categoryContainer: {
      width: '100%',
    },
    categoryTextGroup: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
  });
