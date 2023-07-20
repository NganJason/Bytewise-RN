import { useNavigation } from '@react-navigation/native';
import { useTheme } from '@rneui/themed';
import { StyleSheet, View } from 'react-native';
import {
  HOLDING_TYPE_CUSTOM,
  HOLDING_TYPE_DEFAULT,
} from '../../_shared/apis/enum';
import ROUTES from '../../_shared/constant/routes';
import { AmountText, BaseText, EarningText } from '../Text';
import { BaseChip, BaseRow } from '../View';

const HoldingRow = ({
  holding_id = '',
  holding_type = HOLDING_TYPE_DEFAULT,
  account_id = '',
  symbol = '',
  total_shares = 0,
  latest_value = 0,
  avg_cost = 0,
}) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const navigation = useNavigation();

  const onPress = () => {
    if (holding_type === HOLDING_TYPE_DEFAULT) {
      navigation.navigate(ROUTES.holdingBreakdown, {
        account_id: account_id,
        holding_id: holding_id,
        symbol: symbol,
      });
    } else {
      navigation.navigate(ROUTES.holdingForm, {
        account_id: account_id,
        holding_id: holding_id,
      });
    }
  };

  return (
    <BaseRow onPress={onPress}>
      <View style={styles.leftContainer}>
        <View style={styles.symbol}>
          <BaseText text3 numberOfLines={1}>
            {symbol}
          </BaseText>
          {holding_type === HOLDING_TYPE_CUSTOM && <BaseChip>Custom</BaseChip>}
        </View>

        {holding_type === HOLDING_TYPE_DEFAULT && (
          <BaseText text5 style={styles.subRow}>
            {total_shares} {total_shares > 1 ? 'units' : 'unit'}
          </BaseText>
        )}
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
    symbol: {
      flexDirection: 'row',
    },
    subRow: {
      marginTop: 4,
      color: theme.colors.color8,
    },
    leftContainer: {
      width: '40%',
    },
    rightContainer: {
      alignItems: 'flex-end',
    },
  });

export default HoldingRow;
