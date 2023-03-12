import { View, StyleSheet } from 'react-native';
import { useTheme, Text, LinearProgress } from '@rneui/themed';
import Ionicons from '@expo/vector-icons/Ionicons';

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
        <Text style={styles.budgetHeaderText}>2023 Budget</Text>
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
          <Text style={styles.budgetText}>Budget: S$90,000</Text>
          <Text style={styles.separatorText}> | </Text>
          <Text style={styles.usedText}>Used: S$30,000</Text>
        </View>
        <View style={styles.progress}>
          <LinearProgress
            color={theme.colors.primary}
            trackColor={theme.colors.secondary}
            value={0.5}
          />
        </View>
      </View>

      <View style={styles.budgetItemContainer}>
        <View style={styles.budgetItemInfo}>
          <Text style={styles.budgetText}>Food</Text>
          <Text>S$150</Text>
        </View>
        <View>
          <LinearProgress
            color={theme.colors.primary}
            trackColor={theme.colors.secondary}
            value={0.5}
          />
        </View>
      </View>
    </View>
  );
};

const getStyles = (theme) => {
  return StyleSheet.create({
    pageContainer: {
      height: '100%',
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      paddingTop: '7%',
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
    },
    budgetText: {
      color: theme.colors.primary,
    },
    usedText: {
      color: theme.colors.red0,
    },
    separatorText: {
      color: theme.colors.grey4,
    },
    budgetItemContainer: {
      width: '100%',
      marginTop: '10%',
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
