import React, { useState, useEffect } from 'react';
import { useIsFocused } from '@react-navigation/native';
import {
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  ActivityIndicator,
} from 'react-native';
import { useTheme, LinearProgress, Icon, Button } from '@rneui/themed';
import {
  ArrowSelector,
  BaseScreen,
  BaseDivider,
  BaseText,
  BaseHeader,
} from '../../Components';
import Collapsible from 'react-native-collapsible';

import ROUTES from '../../_shared/constant/routes';
import { formatMonetaryVal, getProgress } from '../../_shared/util/util';
import { useGetBudgetOverviewQuery } from '../../_shared/query/query';
import useSetDate from '../../_shared/hooks/useSetDate';

const getBudgetCategory = (navigation, theme, styles, category) => {
  return (
    <View style={styles.budgetContainer}>
      <Button
        type="clear"
        buttonStyle={styles.budget}
        onPress={() => navigation.navigate(ROUTES.budgetBreakdown)}>
        <View>
          <BaseText h4 style={styles.budgetText}>
            {category.category}
          </BaseText>
        </View>
        <BaseText h4>
          {formatMonetaryVal(category.budget, category.currency)}
        </BaseText>
      </Button>
      <LinearProgress
        trackColor={theme.colors.secondary}
        color={theme.colors.primary}
        style={styles.progressBar}
        value={getProgress(category.used, category.budget)}
      />
    </View>
  );
};

const BudgetScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const isFocused = useIsFocused();
  const styles = getStyles(theme);

  const [expanded, setExpanded] = useState(false);
  const { renderDate, addOneMonth, subOneMonth } = useSetDate();
  const { data: budgetOverview, isLoading } = useGetBudgetOverviewQuery({});

  useEffect(() => {
    setExpanded(false);
  }, [isFocused]);

  const toggleAccordion = () => {
    setExpanded(!expanded);
  };

  return (
    <BaseScreen
      fabProps={{
        show: true,
        placement: 'right',
        iconName: 'add',
        iconColor: theme.colors.white,
        color: theme.colors.primary,
        onPress: () =>
          navigation.navigate(ROUTES.setCategory, {
            isEdit: true,
          }),
      }}>
      <BaseHeader
        center={
          <ArrowSelector
            contentSpacing={theme.spacing.xl}
            onNext={addOneMonth}
            onPrev={subOneMonth}>
            <BaseText h1 style={{ color: theme.colors.color1 }}>
              {renderDate()}
            </BaseText>
          </ArrowSelector>
        }
      />

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" />
        </View>
      ) : (
        <>
          <View style={styles.aggr}>
            <BaseText h4 style={{ color: theme.colors.color1 }}>
              Budget:{' '}
              {formatMonetaryVal(
                budgetOverview.budget,
                budgetOverview.currency,
              )}
            </BaseText>
            <BaseDivider orientation="vertical" margin={theme.spacing.lg} />
            <BaseText h4 style={{ color: theme.colors.red }}>
              Used:{' '}
              {formatMonetaryVal(budgetOverview.used, budgetOverview.currency)}
            </BaseText>
          </View>

          <View style={styles.body}>
            {budgetOverview.monthly_budget.map((category, i) => (
              <React.Fragment key={i}>
                {getBudgetCategory(navigation, theme, styles, category)}
              </React.Fragment>
            ))}

            <TouchableWithoutFeedback onPress={toggleAccordion}>
              <View style={styles.annualContainer}>
                {expanded ? (
                  <Icon
                    name="chevron-up"
                    type="entypo"
                    color={theme.colors.color5}
                  />
                ) : (
                  <Icon
                    name="chevron-down"
                    type="entypo"
                    color={theme.colors.color5}
                  />
                )}

                <BaseText h3 style={styles.annualHeader}>
                  Annual budget
                </BaseText>
              </View>
            </TouchableWithoutFeedback>

            <Collapsible collapsed={!expanded}>
              {budgetOverview.annual_budget.map((category, i) => (
                <React.Fragment key={i}>
                  {getBudgetCategory(navigation, theme, styles, category)}
                </React.Fragment>
              ))}
            </Collapsible>
          </View>
        </>
      )}
    </BaseScreen>
  );
};

const getStyles = theme => {
  return StyleSheet.create({
    aggr: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },
    body: {
      paddingVertical: theme.spacing.xl,
    },
    budgetContainer: {
      marginVertical: theme.spacing.lg,
    },
    budget: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    budgetText: {
      marginBottom: theme.spacing.sm,
    },
    progressBar: {
      height: 2,
      marginVertical: theme.spacing.md,
    },
    annualContainer: {
      flexDirection: 'row',
      marginVertical: theme.spacing.lg,
    },
    annualHeader: {
      color: theme.colors.primary,
    },
    loadingContainer: {
      marginVertical: '50%',
    },
  });
};

export default BudgetScreen;
