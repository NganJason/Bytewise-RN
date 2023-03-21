import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableWithoutFeedback,
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

import { CURRENCY } from '../../_shared/api/data/model';
import ROUTES from '../../_shared/constant/routes';

const mockBudgetCategories = [
  {
    id: 1,
    name: 'Food',
    budget: '150',
    used: '10',
    currency: 'SGD',
  },
  {
    id: 2,
    name: 'Transport',
    budget: '100',
    used: '20',
    currency: 'SGD',
  },
  {
    id: 3,
    name: 'Personal',
    budget: '200',
    used: '100',
    currency: 'SGD',
  },
  {
    id: 4,
    name: 'Groceries',
    budget: '50',
    used: '20',
    currency: 'SGD',
  },
];

const getProgress = (val, total) => {
  return val / total;
};

const getBudgetCategory = (theme, styles, category) => {
  return (
    <View style={styles.budgetContainer}>
      <Button type="clear" buttonStyle={styles.budget} onPress={() => {}}>
        <View style={styles.budgetInfo}>
          <BaseText style={styles.budgetText}>{category.name}</BaseText>
        </View>
        <BaseText>{`${CURRENCY.SGD} ${category.budget}`}</BaseText>
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
  const [expanded, setExpanded] = useState(false);

  const toggleAccordion = () => {
    setExpanded(!expanded);
  };

  return (
    <SafeAreaProvider>
      <ScrollView>
        <Header
          centerComponent={
            <BaseText h2 style={{ color: theme.colors.primary }}>
              Mar 2023
            </BaseText>
          }
          rightComponent={
            <Button type="clear">
              <Icon name="chevron-right" color={theme.colors.grey3} />
            </Button>
          }
          leftComponent={
            <Button type="clear">
              <Icon name="chevron-left" color={theme.colors.grey3} />
            </Button>
          }
          containerStyle={styles.header}
          rightContainerStyle={styles.headerItem}
          leftContainerStyle={styles.headerItem}
          centerContainerStyle={styles.headerItem}
        />

        <View style={styles.aggr}>
          <BaseText h3 style={{ color: theme.colors.primary }}>
            Budget: {CURRENCY.SGD} 90000
          </BaseText>
          <BaseDivider orientation="vertical" margin={theme.spacing.lg} />
          <BaseText h3 style={{ color: theme.colors.red0 }}>
            Used: {CURRENCY.SGD} 30000
          </BaseText>
        </View>

        <View style={styles.body}>
          {mockBudgetCategories.map(category => {
            return (
              <React.Fragment key={category.id}>
                {getBudgetCategory(theme, styles, category)}
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
          <Collapsible collapsed={!expanded} style={styles.collapsible}>
            {mockBudgetCategories.map(category => {
              return (
                <React.Fragment key={category.id}>
                  {getBudgetCategory(theme, styles, category)}
                </React.Fragment>
              );
            })}
          </Collapsible>
        </View>
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
    progress: {
      width: '100%',
      marginVertical: theme.spacing.lg,
    },
    progressBar: {
      height: 1,
      marginVertical: theme.spacing.md,
    },
    annualContainer: {
      flexDirection: 'row',
      marginVertical: theme.spacing.md,
    },
    annualHeader: {
      color: theme.colors.primary,
    },
  });
};

export default BudgetScreen;
