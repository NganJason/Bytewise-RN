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
} from '../../_shared/apis/enum';
import { useGetCategories } from '../../_shared/query';
import ROUTES from '../../_shared/constant/routes';

const CategoryScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  const [isIncomeExpanded, setIsIncomeExpanded] = useState(false);
  const [isExpenseExpanded, setIsExpenseExpanded] = useState(true);
  const isFocused = useIsFocused();

  const [categories, setCategories] = useState([]);

  const getCategories = useGetCategories(
    {},
    {
      onSuccess: function (data) {
        setCategories(data.categories);
      },
    },
  );

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

    categories.forEach(category => {
      if (category.category_type === categoryType) {
        comps.push(<Category category={category} amount="0" />);
      }
    });

    return comps;
  };

  const renderErrorToast = () => {
    if (getCategories.isError) {
      return {
        show: getCategories.isError,
        message1: getCategories.error.message,
        onHide: getCategories.reset,
      };
    }

    return {};
  };

  const isScreenLoading = () => {
    return getCategories.isLoading;
  };

  return (
    <BaseScreen
      isLoading={isScreenLoading()}
      errorToast={renderErrorToast()}
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
                <BaseText h3>Income</BaseText>
                <AmountText showColor>1000</AmountText>
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
                <BaseText h3>Expense</BaseText>
                <AmountText showColor>-1000</AmountText>
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
