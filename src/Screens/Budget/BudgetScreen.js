import React, { useState, useEffect } from 'react';
import { useIsFocused } from '@react-navigation/native';
import { useTheme } from '@rneui/themed';
import { ScrollView } from 'react-native-gesture-handler';

import {
  BaseScreen,
  MonthNavigator,
  BaseAccordion,
  Budget,
  AggrSummary,
} from '../../Components';

import ROUTES from '../../_shared/constant/routes';

import { useGetBudgetOverviewQuery } from '../../_shared/query/query';

const BudgetScreen = ({ navigation }) => {
  const { theme } = useTheme();

  const {
    data: budgetOverview = {
      totalAmount: '',
      totalUsed: '',
      monthly_budget: [],
      annual_budget: [],
    },
    isLoading,
  } = useGetBudgetOverviewQuery({});

  const [isMonthlyExpanded, setIsMonthlyExpanded] = useState(true);
  const [isAnnualExpanded, setIsAnnualExpanded] = useState(false);
  const isFocused = useIsFocused();

  useEffect(() => {
    // revert to default
    setIsMonthlyExpanded(true);
    setIsAnnualExpanded(false);
  }, [isFocused]);

  const toggleMonthly = () => {
    setIsMonthlyExpanded(!isMonthlyExpanded);
  };

  const toggleAnnual = () => {
    setIsAnnualExpanded(!isAnnualExpanded);
  };

  const renderBudgets = (
    budgets = [{ category: { cat_id: 0, cat_name: '' }, budget: '', used: '' }],
  ) => {
    const comps = [];

    budgets.forEach(budget => {
      comps.push(<Budget budget={budget} />);
    });

    return comps;
  };

  return (
    <BaseScreen
      isLoading={isLoading}
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
      <>
        <AggrSummary
          aggrs={[
            { label: 'Budget', amount: `${budgetOverview.totalAmount}` },
            { label: 'Used', amount: `${-budgetOverview.totalUsed}` },
          ]}
        />
        <ScrollView>
          <BaseAccordion
            isExpanded={isMonthlyExpanded}
            onPress={toggleMonthly}
            title="Monthly"
            titleColor={theme.colors.color4}
            items={renderBudgets(budgetOverview.monthly_budget)}
          />
          <BaseAccordion
            isExpanded={isAnnualExpanded}
            onPress={toggleAnnual}
            title="Annual"
            titleColor={theme.colors.color4}
            items={renderBudgets(budgetOverview.annual_budget)}
          />
        </ScrollView>
      </>
    </BaseScreen>
  );
};

export default BudgetScreen;
