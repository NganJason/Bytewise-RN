import { useTheme } from '@rneui/themed';
import { StyleSheet, View } from 'react-native';
import { AmountText, BaseText } from '../Text';
import { BaseRow } from '../View';

const InvestmentHoldings = () => {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  return (
    <View style={styles.body}>
      <BaseRow>
        <View>
          <BaseText text3>VTI</BaseText>
          <BaseText text5>12 units</BaseText>
        </View>

        <View>
          <AmountText text3>3000</AmountText>
          <BaseText text5>-200</BaseText>
        </View>
      </BaseRow>
    </View>
  );
};

const getStyles = theme => StyleSheet.create({});

export default InvestmentHoldings;
