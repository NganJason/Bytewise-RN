import { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableWithoutFeedback,
} from 'react-native';
import { useTheme, LinearProgress, Icon } from '@rneui/themed';
import Collapsible from 'react-native-collapsible';

import Ionicons from '@expo/vector-icons/Ionicons';
import BaseText from '../../Components/BaseText';

const mockBudgetCategories = [
  {
    id: 1,
    name: 'Food',
    budget: 'S$150',
    used: 0.4,
  },
  {
    id: 2,
    name: 'Transport',
    budget: 'S$100',
    used: 0.7,
  },
  {
    id: 3,
    name: 'Personal',
    budget: 'S$200',
    used: 0.1,
  },
  {
    id: 4,
    name: 'Groceries',
    budget: 'S$50',
    used: 0.8,
  },
];

const getBudgetCategory = (theme, styles, category) => {
  return (
    <View style={styles.budgetCatContainer} key={category.id}>
      <View style={styles.budgetCatInfo}>
        <BaseText
          h3
          style={{
            color: theme.colors.grey6,
            fontFamily: theme.fontFamily.regular,
          }}>
          {category.name}
        </BaseText>
        <BaseText
          h3
          style={{
            color: theme.colors.grey6,
            fontFamily: theme.fontFamily.regular,
          }}>
          {category.budget}
        </BaseText>
      </View>
      <View style={styles.progress}>
        <LinearProgress
          color={theme.colors.primary}
          trackColor={theme.colors.secondary}
          value={category.used}
          style={styles.progressBar}
        />
      </View>
    </View>
  );
};

const BudgetScreen = () => {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const [expanded, setExpanded] = useState(false);

  const toggleAccordion = () => {
    setExpanded(!expanded);
  };

  return (
    <ScrollView>
      <View style={styles.pageContainer}>
        <View style={styles.pageHeader}>
          <View style={styles.pageHeaderIcon}>
            <Ionicons
              name="chevron-back-outline"
              size={20}
              color={theme.colors.grey4}
            />
          </View>
          <BaseText
            h2
            style={{
              color: theme.colors.primary,
            }}>
            Mar 2023
          </BaseText>
          <View style={styles.pageHeaderIcon}>
            <Ionicons
              name="chevron-forward-outline"
              size={20}
              color={theme.colors.grey4}
            />
          </View>
        </View>

        <View style={styles.overviewContainer}>
          <View style={styles.overview}>
            <BaseText h4 style={{ color: theme.colors.primary }}>
              Budget: S$90,000
            </BaseText>
            <BaseText h4 style={{ color: theme.colors.grey4 }}>
              {' '}
              |{' '}
            </BaseText>
            <BaseText h4 style={{ color: theme.colors.red0 }}>
              Used: S$30,000
            </BaseText>
          </View>
        </View>

        <View style={styles.budgetContainer}>
          {mockBudgetCategories.map(category => {
            return getBudgetCategory(theme, styles, category);
          })}
        </View>

        <TouchableWithoutFeedback onPress={toggleAccordion}>
          <View style={styles.catHeaderContainer}>
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

            <BaseText h2 style={styles.catHeader}>
              Annual budget
            </BaseText>
          </View>
        </TouchableWithoutFeedback>
        <Collapsible collapsed={!expanded} style={styles.collapsible}>
          {mockBudgetCategories.map(category => {
            return getBudgetCategory(theme, styles, category);
          })}
        </Collapsible>
      </View>
    </ScrollView>
  );
};

const getStyles = theme => {
  return StyleSheet.create({
    pageContainer: {
      height: '100%',
      width: '100%',
      paddingTop: '13%',
      paddingHorizontal: '10%',
    },
    pageHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    pageHeaderIcon: {
      marginTop: '1%',
      marginHorizontal: '3%',
    },
    overviewContainer: {
      alignItems: 'center',
      marginBottom: '8%',
    },
    overview: {
      flexDirection: 'row',
      marginVertical: '6%',
    },
    progress: {
      width: '100%',
      marginTop: '1.5%',
    },
    progressBar: {
      height: 1,
    },
    budgetContainer: {
      width: '100%',
    },
    budgetCatContainer: {
      width: '100%',
      marginBottom: '10%',
    },
    budgetCatInfo: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: '3%',
    },
    catHeaderContainer: {
      width: '100%',
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: '8%',
      shadowColor: theme.colors.grey4,
      // borderBottomColor: theme.colors.grey4,
      // borderBottomWidth: '0.5%',
    },
    catHeader: {
      color: theme.colors.primary,
      fontFamily: theme.fontFamily.bold,
    },
  });
};

export default BudgetScreen;
