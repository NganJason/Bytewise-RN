import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { useTheme } from '@rneui/themed';

import {
  BaseScreen,
  MonthNavigator,
  BaseAccordion,
  BaseScrollView,
  Category,
  BaseText,
  AmountText,
} from '../../Components';

import ROUTES from '../../_shared/constant/routes';

const INCOME_CATEGORIES = [
  {
    category: { category_name: 'Shopee Salary' },
    amount: '7050',
  },
  {
    category: { category_name: 'REIT Dividend' },
    amount: '500',
  },
];

const EXPENSE_CATEGORIES = [
  {
    category: { category_name: 'Food' },
    amount: '200',
  },
  {
    category: { category_name: 'Transport' },
    amount: '10',
  },
];

const CategoryScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  const [isIncomeExpanded, setIsIncomeExpanded] = useState(false);
  const [isExpenseExpanded, setIsExpenseExpanded] = useState(true);
  const isFocused = useIsFocused();

  useEffect(() => {
    // revert to default
    setIsIncomeExpanded(false);
    setIsExpenseExpanded(true);
  }, [isFocused]);

  const toggleMonthly = () => {
    setIsIncomeExpanded(!isIncomeExpanded);
  };

  const toggleAnnual = () => {
    setIsExpenseExpanded(!isExpenseExpanded);
  };

  const renderCategories = (
    categories = [{ category: { category_name: '' }, amount: '' }],
  ) => {
    const comps = [];

    categories.forEach(category => {
      comps.push(
        <Category category={category.category} amount={category.amount} />,
      );
    });

    return comps;
  };

  return (
    <BaseScreen
      headerProps={{
        allowBack: false,
        centerComponent: <MonthNavigator />,
      }}
      fabProps={{
        show: true,
        placement: 'right',
        iconName: 'add',
        iconColor: theme.colors.white,
        color: theme.colors.primary,
        onPress: () => navigation.navigate(ROUTES.categoryForm),
      }}>
      <BaseScrollView>
        <BaseAccordion
          isExpanded={isIncomeExpanded}
          onPress={toggleMonthly}
          title={
            <View style={styles.accordionTitle}>
              <BaseText h3>Income</BaseText>
              <AmountText showColor>1000</AmountText>
            </View>
          }
          titleColor={theme.colors.color4}
          items={renderCategories(INCOME_CATEGORIES)}
        />
        <BaseAccordion
          isExpanded={isExpenseExpanded}
          onPress={toggleAnnual}
          title={
            <View style={styles.accordionTitle}>
              <BaseText h3>Expense</BaseText>
              <AmountText showColor>-1000</AmountText>
            </View>
          }
          titleColor={theme.colors.color4}
          items={renderCategories(EXPENSE_CATEGORIES)}
        />
      </BaseScrollView>
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
  });
