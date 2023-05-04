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

import { useGetCategories } from '../../_shared/query';

import ROUTES from '../../_shared/constant/routes';
import {
  TRANSACTION_TYPE_EXPENSE,
  TRANSACTION_TYPE_INCOME,
} from '../../_shared/apis/1_enum';
import { TouchableOpacity } from 'react-native-gesture-handler';

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

  const renderCategories = (categories = [{ cat_name: '' }], categoryType) => {
    const comps = [];

    categories.forEach(category => {
      if (category.cat_type === categoryType) {
        comps.push(<Category category={category} amount="0" />);
      }
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
      <View style={styles.editBudget}>
        <TouchableOpacity
          onPress={() => navigation.navigate(ROUTES.budgetList)}>
          <BaseText h4 style={{ color: theme.colors.color4 }}>
            Manage budget
          </BaseText>
        </TouchableOpacity>
      </View>
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
          items={renderCategories(categoryQuery.data, TRANSACTION_TYPE_INCOME)}
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
          items={renderCategories(categoryQuery.data, TRANSACTION_TYPE_EXPENSE)}
        />
      </BaseScrollView>
    </BaseScreen>
  );
};

export default CategoryScreen;

const getStyles = _ =>
  StyleSheet.create({
    editBudget: {
      width: '100%',
      alignItems: 'flex-end',
      marginVertical: 10,
    },
    accordionTitle: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '100%',
    },
  });
