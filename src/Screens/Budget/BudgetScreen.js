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
import { BaseLoadableView, BaseRow } from '../../Components/View';

import {
  BUDGET_TYPE_ANNUAL,
  BUDGET_TYPE_MONTHLY,
} from '../../_shared/apis/enum';
import { EmptyContentConfig } from '../../_shared/constant/constant';
import ROUTES from '../../_shared/constant/routes';
import useDimension from '../../_shared/hooks/dimension';
import { useGetBudgets } from '../../_shared/query/budget';
import { getDateString } from '../../_shared/util/date';
import { capitalize } from '../../_shared/util/string';
import { getBudgetAmountFromBreakdown } from '../../_shared/util/budget';

const BudgetScreen = () => {
  const { theme } = useTheme();
  const { screenHeight } = useDimension();
  const styles = getStyles(theme, screenHeight);
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

        rows.push(
          <BaseRow
            key={budget.budget_id}
            onPress={() => {
              navigation.navigate(ROUTES.budgetForm, {
                budget_id: budget.budget_id,
                target_date_string: getDateString(activeDate),
              });
            }}>
            <BaseText text3>{capitalize(budget.budget_name)}</BaseText>
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
          height="80%"
        />
      );
    }

    return rows;
  };

  return (
    <BaseScreen
      allowLoadable={false}
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
          <BaseLoadableView isLoading={getBudgets.isLoading}>
            {renderRows(BUDGET_TYPE_MONTHLY)}
          </BaseLoadableView>
        </View>

        <View style={styles.container}>
          <View style={styles.title}>
            <BaseText h3>Annual</BaseText>
          </View>
          <BaseLoadableView isLoading={getBudgets.isLoading}>
            {renderRows(BUDGET_TYPE_ANNUAL)}
          </BaseLoadableView>
        </View>
      </BaseScrollView>
    </BaseScreen>
  );
};

const getStyles = (theme, screenHeight) => {
  return StyleSheet.create({
    header: {
      alignItems: 'center',
    },
    buttonContainer: {
      marginBottom: 10,
    },
    container: {
      marginBottom: theme.spacing.xl,
      minHeight: screenHeight * 0.25,
    },
    title: {
      marginVertical: theme.spacing.md,
    },
  });
};

export default BudgetScreen;
