import { useNavigation } from '@react-navigation/native';
import { useTheme } from '@rneui/themed';
import { StyleSheet, View } from 'react-native';
import ROUTES from '../../_shared/constant/routes';
import { AmountText, BaseText, EarningText } from '../Text';
import { BaseRow } from '../View';

const HoldingRow = ({
  holding_id = '',
  account_id = '',
  symbol = '',
  total_shares = 0,
  latest_value = 0,
  avg_cost = 0,
}) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const navigation = useNavigation();

  return (
    <BaseRow
      onPress={() => {
        navigation.navigate(ROUTES.holdingBreakdown, {
          account_id: account_id,
          holding_id: holding_id,
          symbol: symbol,
        });
      }}>
      <View>
        <BaseText text3>{symbol}</BaseText>
        <BaseText text5 style={styles.subRow}>
          {total_shares} {total_shares > 1 ? 'units' : 'unit'}
        </BaseText>
      </View>

      <View style={styles.rightContainer}>
        <AmountText text3>{latest_value}</AmountText>

        <EarningText
          currVal={latest_value}
          initialVal={avg_cost}
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

export default HoldingRow;
