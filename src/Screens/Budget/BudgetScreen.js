import { useNavigation } from '@react-navigation/native';
import { useTheme } from '@rneui/themed';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import {
  AmountText,
  BaseButton,
  BaseScreen,
  BaseScrollView,
  BaseText,
  DateNavigator,
} from '../../Components';
import { EmptyContent } from '../../Components/Common';
import { BaseDivider, BaseRow } from '../../Components/View';

import {
  BUDGET_TYPE_ANNUAL,
  BUDGET_TYPE_MONTHLY,
} from '../../_shared/apis/enum';
import { EmptyContentConfig } from '../../_shared/constant/constant';
import ROUTES from '../../_shared/constant/routes';
import { useGetBudgets } from '../../_shared/query/budget';
import { getDateString, getYear, getMonth } from '../../_shared/util/date';
import { capitalizeWords } from '../../_shared/util/string';

const BudgetScreen = () => {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const navigation = useNavigation();

  const [activeDate, setActiveDate] = useState(new Date());
  const onDateChange = e => {
    setActiveDate(e);
  };

  const getBudgets = useGetBudgets({
    date: getDateString(activeDate),
  });

  const onAddBugdet = () => {
    navigation.navigate(ROUTES.budgetForm);
  };

  const renderRows = (type = BUDGET_TYPE_MONTHLY) => {
    let budgets = getBudgets?.data?.budgets || [];
    let rows = [];

    budgets.map(budget => {
      if (budget.budget_type === type) {
        let amount = getBudgetAmountFromBreakdown(
          activeDate,
          budget.budget_breakdowns,
          budget.budget_type,
        );

        if (amount === 0) {
          return;
        }

        rows.push(
          <BaseRow
            key={budget.budget_id}
            onPress={() => {
              navigation.navigate(ROUTES.budgetForm, {
                budget_id: budget.budget_id,
                target_date_string: getDateString(activeDate),
              });
            }}>
            <BaseText text3>{capitalizeWords(budget.budget_name)}</BaseText>
            <AmountText text3>{amount}</AmountText>
          </BaseRow>,
        );
      }
    });

    if (rows.length === 0 && !getBudgets.isLoading) {
      return (
        <EmptyContent
          item={
            type === BUDGET_TYPE_MONTHLY
              ? EmptyContentConfig.monthlyBudget
              : EmptyContentConfig.annualBudget
          }
          route={ROUTES.budgetForm}
        />
      );
    }

    return rows;
  };

  const isMonthlyBudgetEmpty = () => {
    let budgets = getBudgets?.data?.budgets || [];
    for (let i = 0; i < budgets.length; i++) {
      if (budgets[i].budget_type === BUDGET_TYPE_MONTHLY) {
        let amount = getBudgetAmountFromBreakdown(
          activeDate,
          budgets[i].budget_breakdowns,
          budgets[i].budget_type,
        );

        if (amount !== 0) {
          return false;
        }
      }
    }

    return true;
  };

  return (
    <BaseScreen
      isLoading={getBudgets.isLoading}
      headerProps={{
        allowBack: true,
        centerComponent: (
          <View style={styles.header}>
            <BaseText h2>Budgets</BaseText>
            <DateNavigator
              startingDate={activeDate}
              onForward={onDateChange}
              onBackward={onDateChange}
            />
          </View>
        ),
      }}>
      <View style={styles.buttonContainer}>
        <BaseButton
          title="Add budget"
          type="secondary"
          align="flex-end"
          size="sm"
          onPress={onAddBugdet}
        />
      </View>
      <BaseScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          <View style={styles.title}>
            <BaseText h3>Monthly</BaseText>
          </View>
          {renderRows(BUDGET_TYPE_MONTHLY)}
        </View>

        {isMonthlyBudgetEmpty() && <BaseDivider margin={theme.spacing.md} />}

        <View style={styles.container}>
          <View style={styles.title}>
            <BaseText h3>Annual</BaseText>
          </View>
          {renderRows(BUDGET_TYPE_ANNUAL)}
        </View>
      </BaseScrollView>
    </BaseScreen>
  );
};

const getStyles = theme => {
  return StyleSheet.create({
    header: {
      alignItems: 'center',
    },
    buttonContainer: {
      marginBottom: 10,
    },
    container: {
      marginBottom: theme.spacing.xl,
      minHeight: '35%',
    },
    title: {
      marginVertical: theme.spacing.md,
    },
  });
};

export default BudgetScreen;

const getBudgetAmountFromBreakdown = (
  activeDate = new Date(),
  breakdowns = [],
  budgetType = BUDGET_TYPE_MONTHLY,
) => {
  let amount = 0;
  let year = getYear(activeDate);
  let month = getMonth(activeDate);

  breakdowns.map(val => {
    if (budgetType === BUDGET_TYPE_MONTHLY) {
      if (val.year === year && val.month === month) {
        amount = val.amount;
      }
    } else {
      if (val.year === year) {
        amount = val.amount;
      }
    }
  });

  return amount;
};
