import { useNavigation } from '@react-navigation/native';
import { useTheme } from '@rneui/themed';
import { StyleSheet, View } from 'react-native';
import ROUTES from '../../_shared/constant/routes';
import { AmountText, BaseText, EarningText } from '../Text';
import { BaseRow } from '../View';

const InvestmentHolding = ({ holding }) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const navigation = useNavigation();

  const { symbol = '', unit = 0, amount = 0, cost = 0 } = holding || {};

  return (
    <BaseRow
      onPress={() => {
        navigation.navigate(ROUTES.holdingBreakdown);
      }}>
      <View>
        <BaseText text3>{symbol}</BaseText>
        <BaseText text5 style={styles.subRow}>
          {unit} {unit > 1 ? 'units' : 'unit'}
        </BaseText>
      </View>

      <View style={styles.rightContainer}>
        <AmountText text3>{amount}</AmountText>

        <EarningText
          currVal={amount}
          initialVal={cost}
          text5
          style={styles.subRow}
        />
      </View>
    </BaseRow>
  );
};

const getStyles = theme =>
  StyleSheet.create({
    subRow: {
      marginTop: 4,
      color: theme.colors.color8,
    },
    rightContainer: {
      alignItems: 'flex-end',
    },
  });

export default InvestmentHolding;
