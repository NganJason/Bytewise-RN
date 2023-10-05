import { useNavigation } from '@react-navigation/native';
import { useTheme } from '@rneui/themed';
import { StyleSheet, View } from 'react-native';
import {
  HOLDING_TYPE_CUSTOM,
  HOLDING_TYPE_DEFAULT,
} from '../../_shared/apis/enum';
import ROUTES from '../../_shared/constant/routes';
import { Amount } from '../../_shared/object';
import { DEFAULT_CURRENCY } from '../../_shared/util';
import { AmountText, BaseText, EarningText } from '../Text';
import { BaseChip, BaseRow } from '../View';

const HoldingRow = ({
  holding_id: holdingID = '',
  holding_type: holdingType = HOLDING_TYPE_DEFAULT,
  account_id: accountID = '',
  symbol = '',
  total_shares: totalShares = 0,
  latest_value: latestValue = 0,
  currency = DEFAULT_CURRENCY,
  gain = 0,
  percent_gain: percentGain = 0,
}) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const navigation = useNavigation();

  const onPress = () => {
    if (holdingType === HOLDING_TYPE_DEFAULT) {
      navigation.navigate(ROUTES.holdingBreakdown, {
        account_id: accountID,
        holding_id: holdingID,
        symbol: symbol,
      });
    } else {
      navigation.navigate(ROUTES.holdingForm, {
        account_id: accountID,
        holding_id: holdingID,
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
          {holdingType === HOLDING_TYPE_CUSTOM && <BaseChip>Custom</BaseChip>}
        </View>

        {holdingType === HOLDING_TYPE_DEFAULT && (
          <BaseText text5 style={styles.subRow}>
            {totalShares} {totalShares > 1 ? 'units' : 'unit'}
          </BaseText>
        )}
      </View>

      <View style={styles.rightContainer}>
        <AmountText
          text3
          amount={new Amount(latestValue, currency)}
          sensitive
        />
        <EarningText
          gain={new Amount(gain, currency)}
          percentGain={percentGain}
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
