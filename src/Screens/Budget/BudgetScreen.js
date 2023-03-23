import React, { useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableWithoutFeedback,
  ActivityIndicator,
} from 'react-native';
import {
  useTheme,
  LinearProgress,
  Icon,
  Header,
  Button,
  FAB,
} from '@rneui/themed';
import Collapsible from 'react-native-collapsible';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import BaseText from '../../Components/BaseText';
import BaseDivider from '../../Components/BaseDivider';

import ROUTES from '../../_shared/constant/routes';
import { useGetBudgetOverviewQuery } from '../../_shared/query/query';
import {
  formatMonetaryVal,
  getProgress,
  moveMonth,
} from '../../_shared/util/util';
import { MONTHS } from '../../_shared/constant/constant';

const TODAY = new Date();

const getBudgetCategory = (navigation, theme, styles, category) => {
  return (
    <View style={styles.budgetContainer}>
      <Button
        type="clear"
        buttonStyle={styles.budget}
        onPress={() => navigation.navigate(ROUTES.addCategory)}>
        <View>
          <BaseText style={styles.budgetText}>{category.category}</BaseText>
        </View>
        <BaseText>
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
  const styles = getStyles(theme);

  const [date, setDate] = useState(TODAY);
  const [expanded, setExpanded] = useState(false);
  const { data: budgetOverview, isLoading } = useGetBudgetOverviewQuery({});

  const renderDate = useCallback(() => {
    const month = MONTHS[date.getMonth()];
    return `${month} ${date.getFullYear()}`;
  }, [date]);

  const addOneMonth = () => setDate(moveMonth(date, 1));
  const subOneMonth = () => setDate(moveMonth(date, -1));

  const toggleAccordion = () => {
    setExpanded(!expanded);
  };

  return (
    <SafeAreaProvider>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <Header
          centerComponent={
            <BaseText h2 style={{ color: theme.colors.primary }}>
              {renderDate()}
            </BaseText>
          }
          rightComponent={
            <Button onPress={addOneMonth} type="clear">
              <Icon name="chevron-right" color={theme.colors.grey3} />
            </Button>
          }
          leftComponent={
            <Button onPress={subOneMonth} type="clear">
              <Icon name="chevron-left" color={theme.colors.grey3} />
            </Button>
          }
          containerStyle={styles.header}
          rightContainerStyle={styles.headerItem}
          leftContainerStyle={styles.headerItem}
          centerContainerStyle={styles.headerItem}
        />

        {isLoading ? (
          <React.Fragment>
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" />
            </View>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <View style={styles.aggr}>
              <BaseText h3 style={{ color: theme.colors.primary }}>
                Budget:{' '}
                {formatMonetaryVal(
                  budgetOverview.budget,
                  budgetOverview.currency,
                )}
              </BaseText>
              <BaseDivider orientation="vertical" margin={theme.spacing.lg} />
              <BaseText h3 style={{ color: theme.colors.red0 }}>
                Used:{' '}
                {formatMonetaryVal(
                  budgetOverview.used,
                  budgetOverview.currency,
                )}
              </BaseText>
            </View>

            <View style={styles.body}>
              {budgetOverview.monthly_budget.map(category => {
                return (
                  <React.Fragment key={category.id}>
                    {getBudgetCategory(navigation, theme, styles, category)}
                  </React.Fragment>
                );
              })}

              <TouchableWithoutFeedback onPress={toggleAccordion}>
                <View style={styles.annualContainer}>
                  {expanded ? (
                    <Icon
                      name="chevron-up"
                      type="entypo"
                      color={theme.colors.grey4}
                    />
                  ) : (
                    <Icon
                      name="chevron-down"
                      type="entypo"
                      color={theme.colors.grey4}
                    />
                  )}

                  <BaseText h2 style={styles.annualHeader}>
                    Annual budget
                  </BaseText>
                </View>
              </TouchableWithoutFeedback>
              <Collapsible collapsed={!expanded}>
                {budgetOverview.annual_budget.map(category => {
                  return (
                    <React.Fragment key={category.id}>
                      {getBudgetCategory(navigation, theme, styles, category)}
                    </React.Fragment>
                  );
                })}
              </Collapsible>
            </View>
          </React.Fragment>
        )}
      </ScrollView>
      <FAB
        placement="right"
        icon={<Icon name="add" color={theme.colors.white} />}
        color={theme.colors.primary}
        onPress={() => navigation.navigate(ROUTES.addCategory)}
      />
    </SafeAreaProvider>
  );
};

const getStyles = theme => {
  return StyleSheet.create({
    scrollView: {
      flexGrow: 1,
    },
    header: {
      width: '60%',
      alignSelf: 'center',
      backgroundColor: theme.colors.white,
      borderBottomColor: theme.colors.white,
      paddingVertical: theme.spacing.xl,
    },
    headerItem: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    aggr: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },
    loadingContainer: {
      marginVertical: '50%',
    },
    body: {
      padding: theme.spacing.xl,
    },
    budgetContainer: {
      marginVertical: theme.spacing.md,
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
      marginVertical: theme.spacing.md,
    },
    annualHeader: {
      color: theme.colors.primary,
      fontFamily: theme.fontFamily.bold,
    },
  });
};

export default BudgetScreen;
