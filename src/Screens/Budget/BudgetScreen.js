import { View, StyleSheet } from 'react-native';
import { useTheme, LinearProgress, Button } from '@rneui/themed';
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
        />
      </View>
    </View>
  );
};

const BudgetScreen = () => {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  return (
    <View style={styles.pageContainer}>
      <View style={styles.budgetHeader}>
        <View style={styles.budgetHeaderIcon}>
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
          2023 Budget
        </BaseText>
        <View style={styles.budgetHeaderIcon}>
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
        <View style={styles.progress}>
          <LinearProgress
            color={theme.colors.primary}
            trackColor={theme.colors.secondary}
            value={0.5}
          />
        </View>
      </View>

      {mockBudgetCategories.map(category => {
        return getBudgetCategory(theme, styles, category);
      })}

      <Button
        buttonStyle={styles.editBtn}
        containerStyle={styles.editBtnContainer}>
        <BaseText
          h4
          style={{
            color: theme.colors.grey2,
            fontFamily: theme.fontFamily.medium,
          }}>
          Edit
        </BaseText>
      </Button>
    </View>
  );
};

const getStyles = theme => {
  return StyleSheet.create({
    pageContainer: {
      height: '100%',
      width: '100%',
      alignItems: 'center',
      paddingTop: '13%',
      paddingHorizontal: '10%',
    },
    budgetHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    budgetHeaderIcon: {
      marginTop: '1%',
      marginHorizontal: '3%',
    },
    overviewContainer: {
      width: '90%',
      alignItems: 'center',
      marginBottom: '5%',
    },
    overview: {
      flexDirection: 'row',
      marginVertical: '6%',
    },
    progress: {
      width: '100%',
      marginTop: '1.5%',
    },
    budgetCatContainer: {
      width: '100%',
      marginTop: '12%',
    },
    budgetCatInfo: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: '3%',
    },
    editBtn: {
      borderRadius: '7',
      backgroundColor: theme.colors.secondary,
    },
    editBtnContainer: {
      marginTop: '15%',
    },
  });
};

export default BudgetScreen;
