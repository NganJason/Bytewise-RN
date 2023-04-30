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
} from '../../Components';

import { useGetCategories } from '../../_shared/api/query';

import ROUTES from '../../_shared/constant/routes';

const CategoryScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  const [isIncomeExpanded, setIsIncomeExpanded] = useState(false);
  const [isExpenseExpanded, setIsExpenseExpanded] = useState(true);
  const isFocused = useIsFocused();

  const categoryQuery = useGetCategories();

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

  const renderCategories = (categories = [{ category_name: '' }]) => {
    const comps = [];

    categories.forEach(category => {
      comps.push(<Category category={category} amount="0" />);
    });

    return comps;
  };

  return (
    <BaseScreen
      isLoading={categoryQuery.isLoading}
      headerProps={{
        allowBack: false,
        centerComponent: <DateNavigator />,
      }}
      fabProps={{
        show: true,
        placement: 'right',
        iconName: 'add',
        iconColor: theme.colors.white,
        color: theme.colors.primary,
        onPress: () => navigation.navigate(ROUTES.categoryForm),
      }}>
      <BaseScrollView showsVerticalScrollIndicator={false}>
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
          items={renderCategories(categoryQuery.data)}
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
          items={renderCategories(categoryQuery.data)}
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
