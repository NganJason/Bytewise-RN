import { Icon, useTheme } from '@rneui/themed';
import { StyleSheet, View } from 'react-native';
import { BaseText } from '../../Text';

const BudgetTypeDesc = () => {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  return (
    <View>
      <Icon
        name="info"
        type="feather"
        size={20}
        style={styles.icon}
        color={theme.colors.color7}
      />
      <View style={styles.descSection}>
        <BaseText text1 margin={{ bottom: 10 }}>
          Monthly Budget
        </BaseText>
        <BaseText text3>Budget for monthly costs.</BaseText>
        <BaseText text3 margin={{ top: 6 }}>
          E.g. Food, groceries, rental.
        </BaseText>
      </View>

      <View style={styles.descSection}>
        <BaseText text1 margin={{ bottom: 10 }}>
          Annual budget
        </BaseText>
        <BaseText>Budget for one-time or yearly costs.</BaseText>
        <BaseText text3 margin={{ top: 6 }}>
          E.g. Vacation, skincare, supplement.
        </BaseText>
      </View>
    </View>
  );
};

const getStyles = theme =>
  StyleSheet.create({
    icon: { alignSelf: 'flex-start', marginBottom: 14 },
    descSection: {
      marginBottom: 30,
    },
  });

export default BudgetTypeDesc;
