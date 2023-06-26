import { useTheme } from '@rneui/themed';
import { StyleSheet, View } from 'react-native';
import { AmountText, BaseText, EarningText } from '../Text';
import { BaseRow } from '../View';

const InvestmentHoldings = () => {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  return (
    <View style={styles.body}>
      <BaseRow>
        <View>
          <BaseText text3 style={styles.rowText}>
            VTI
          </BaseText>
          <BaseText text5>12 units</BaseText>
        </View>

        <View style={styles.amount}>
          <AmountText text3 style={styles.rowText}>
            3000
          </AmountText>

          <EarningText currVal={3000} initialVal={3200} text5 />
        </View>
      </BaseRow>
    </View>
  );
};

const getStyles = theme =>
  StyleSheet.create({
    rowText: {
      marginBottom: 4,
    },
    amount: {
      alignItems: 'flex-end',
    },
  });

export default InvestmentHoldings;
