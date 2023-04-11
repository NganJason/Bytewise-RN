import React, { useState, useEffect } from 'react';
import { useIsFocused } from '@react-navigation/native';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '@rneui/themed';
import { ScrollView } from 'react-native-gesture-handler';

import {
  BaseScreen,
  MonthNavigator,
  TextGroup,
  AmountText,
  BaseAccordion,
  Budget,
} from '../../Components';

import ROUTES from '../../_shared/constant/routes';
import { useGetBudgetOverviewQuery } from '../../_shared/query/query';

// const getBudgetCategory = (navigation, theme, styles, category) => {
//   return (
//     <View style={styles.budgetContainer}>
//       <Button
//         type="clear"
//         buttonStyle={styles.budget}
//         onPress={() => navigation.navigate(ROUTES.budgetBreakdown)}>
//         <View>
//           <BaseText h4 style={styles.budgetText}>
//             {category.category}
//           </BaseText>
//         </View>
//         <BaseText h4>
//           {formatMonetaryVal(category.budget, category.currency)}
//         </BaseText>
//       </Button>
//       <LinearProgress
//         trackColor={theme.colors.secondary}
//         color={theme.colors.primary}
//         style={styles.progressBar}
//         value={getProgress(category.used, category.budget)}
//       />
//     </View>
//   );
// };

const BudgetScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  const {
    data: budgetOverview = {
      totalBudget: '',
      totalUsed: '',
      monthly_budget: [],
      annual_budget: [],
    },
    isLoading,
  } = useGetBudgetOverviewQuery({});

  const [isMonthlyExpanded, setIsMonthlyExpanded] = useState(false);
  const [isAnnualExpanded, setIsAnnualExpanded] = useState(false);
  const isFocused = useIsFocused();

  useEffect(() => {
    setIsMonthlyExpanded(false);
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
        show: true,
        allowBack: false,
        centerComponent: <MonthNavigator />,
      }}
      fabProps={{
        show: true,
        placement: 'right',
        iconName: 'add',
        iconColor: theme.colors.white,
        color: theme.colors.primary,
        onPress: () =>
          navigation.navigate(ROUTES.setCategory, { isEdit: false }),
      }}>
      <>
        <View style={styles.textGroupWrapper}>
          <TextGroup
            texts={[
              { label: 'Budget: ', value: budgetOverview.totalBudget },
              { label: 'Used: ', value: -budgetOverview.totalUsed },
            ]}
            ValueComponent={AmountText}
          />
        </View>
        <ScrollView>
          <BaseAccordion
            isExpanded={isMonthlyExpanded}
            onPress={toggleMonthly}
            title="Monthly"
            items={renderBudgets(budgetOverview.monthly_budget)}
          />
          <BaseAccordion
            isExpanded={isAnnualExpanded}
            onPress={toggleAnnual}
            title="Annual"
            items={renderBudgets(budgetOverview.annual_budget)}
          />
        </ScrollView>
      </>
    </BaseScreen>
  );
};

const getStyles = _ => {
  return StyleSheet.create({
    textGroupWrapper: {
      paddingBottom: 18,
    },

    // budgetContainer: {
    //   marginVertical: theme.spacing.lg,
    // },
    // budget: {
    //   flexDirection: 'row',
    //   justifyContent: 'space-between',
    // },
    // budgetText: {
    //   marginBottom: theme.spacing.sm,
    // },
    // progressBar: {
    //   height: 2,
    //   marginVertical: theme.spacing.md,
    // },
    // annualContainer: {
    //   flexDirection: 'row',
    //   marginVertical: theme.spacing.lg,
    // },
    // annualHeader: {
    //   color: theme.colors.primary,
    // },
    // loadingContainer: {
    //   marginVertical: '50%',
    // },
  });
};

export default BudgetScreen;
