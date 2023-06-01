import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { useTheme } from '@rneui/themed';

import {
  BaseScreen,
  DateNavigator,
  BaseAccordion,
  BaseScrollView,
  Category,
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

const CategoryScreen = ({ navigation }) => {
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

  const [isIncomeExpanded, setIsIncomeExpanded] = useState(false);
  const [isExpenseExpanded, setIsExpenseExpanded] = useState(true);
  const isFocused = useIsFocused();

  const getCategoriesQuery = useGetCategories({});

  useEffect(() => {
    // revert to default
    setIsIncomeExpanded(false);
    setIsExpenseExpanded(true);
  }, [isFocused]);

  const toggleIncome = () => {
    setIsIncomeExpanded(!isIncomeExpanded);
  };

  const toggleExpense = () => {
    setIsExpenseExpanded(!isExpenseExpanded);
  };

  const renderCategories = categoryType => {
    const comps = [];

    getCategoriesQuery.data?.categories.forEach(category => {
      if (category.category_type === categoryType) {
        const sum =
          aggrTransactionsByCategoryQuery.data?.results?.[category.category_id]
            ?.sum;
        comps.push(<Category category={category} amount={sum} />);
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
      category_ids: getCategoriesQuery.data?.categories.map(
        category => category.category_id,
      ),
      transaction_time: {
        gte: timeRange[0],
        lte: timeRange[1],
      },
    },
    { enabled: !getCategoriesQuery.isLoading && !getCategoriesQuery.isError },
  );

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
                  ].sum || 0}
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
                  ].sum || 0}
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
  });
