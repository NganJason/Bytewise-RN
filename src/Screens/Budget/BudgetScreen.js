import React, { useState, useEffect } from 'react';
import { useIsFocused } from '@react-navigation/native';
import {
  View,
  StyleSheet,
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
import {
  ArrowSelector,
  BaseScreen,
  BaseDivider,
  BaseText,
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

  const getFab = () => {
    return (
      <FAB
        placement="right"
        icon={<Icon name="add" color={theme.colors.white} />}
        color={theme.colors.primary}
        onPress={() =>
          navigation.navigate(ROUTES.setCategory, { isEdit: false })
        }
      />
    );
  };

  return (
    <BaseScreen fab={getFab()}>
      <Header
        centerComponent={
          <ArrowSelector
            contentSpacing={theme.spacing.xl}
            onNext={addOneMonth}
            onPrev={subOneMonth}>
            <BaseText h2 style={{ color: theme.colors.primary }}>
              {renderDate()}
            </BaseText>
          </ArrowSelector>
        }
        containerStyle={styles.header}
      />

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" />
        </View>
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
              {formatMonetaryVal(budgetOverview.used, budgetOverview.currency)}
            </BaseText>
          </View>

          <View style={styles.body}>
            {budgetOverview.monthly_budget.map(category => (
              <React.Fragment key={category.id}>
                {getBudgetCategory(navigation, theme, styles, category)}
              </React.Fragment>
            ))}

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
              {budgetOverview.annual_budget.map(category => (
                <React.Fragment key={category.id}>
                  {getBudgetCategory(navigation, theme, styles, category)}
                </React.Fragment>
              ))}
            </Collapsible>
          </View>
        </React.Fragment>
      )}
    </BaseScreen>
  );
};

const getStyles = theme => {
  return StyleSheet.create({
    header: {
      width: '60%',
      alignSelf: 'center',
      backgroundColor: theme.colors.white,
      borderBottomColor: theme.colors.white,
      paddingVertical: theme.spacing.xl,
    },
    aggr: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
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
    },
    loadingContainer: {
      marginVertical: '50%',
    },
  });
};

export default BudgetScreen;
