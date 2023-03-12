import { View, StyleSheet } from 'react-native';
import { useTheme, LinearProgress } from '@rneui/themed';
import Ionicons from '@expo/vector-icons/Ionicons';
import BaseText from '../../Components/BaseText';

const fakeCategory = [
  {
    name: 'Food',
    budget: 'S$150',
    used: 0.4,
  },
  {
    name: 'Transport',
    budget: 'S$100',
    used: 0.7,
  },
  {
    name: 'Personal',
    budget: 'S$200',
    used: 0.1,
  },
  {
    name: 'Groceries',
    budget: 'S$50',
    used: 0.8,
  },
];

const getBudgetCategory = (theme, styles, category) => {
  return (
    <View style={styles.budgetItemContainer}>
      <View style={styles.budgetItemInfo}>
        <BaseText h5 style={{ color: theme.colors.grey6 }}>
          {category.name}
        </BaseText>
        <BaseText h5 style={{ color: theme.colors.grey6 }}>
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
          h3
          style={{
            color: theme.colors.primary,
            fontFamily: theme.fontFamily.semiBold,
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
          <BaseText style={{ color: theme.colors.primary, fontSize: '15%' }}>
            Budget: S$90,000
          </BaseText>
          <BaseText style={{ color: theme.colors.grey4, fontSize: '15%' }}>
            {' '}
            |{' '}
          </BaseText>
          <BaseText style={{ color: theme.colors.red0, fontSize: '15%' }}>
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

      {fakeCategory.map(category => {
        return getBudgetCategory(theme, styles, category);
      })}
    </View>
  );
};

const getStyles = theme => {
  return StyleSheet.create({
    pageContainer: {
      height: '100%',
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      paddingTop: '13%',
      paddingHorizontal: '10%',
    },
    budgetHeader: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    budgetHeaderText: {
      color: theme.colors.primary,
      fontFamily: theme.fontFamily.semiBold,
      fontSize: '25%',
    },
    budgetHeaderIcon: {
      marginTop: '1%',
      marginHorizontal: '3%',
    },
    overviewContainer: {
      width: '90%',
      display: 'flex',
      alignItems: 'center',
      marginBottom: '5%',
    },
    overview: {
      display: 'flex',
      flexDirection: 'row',
      marginVertical: '6%',
    },
    progress: {
      width: '100%',
      marginTop: '1.5%',
    },
    budgetItemContainer: {
      width: '100%',
      marginTop: '13%',
    },
    budgetItemInfo: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: '3%',
    },
  });
};

export default BudgetScreen;
