import { useNavigation } from '@react-navigation/native';
import { useTheme } from '@rneui/themed';
import { StyleSheet, View } from 'react-native';
import {
  HOLDING_TYPE_CUSTOM,
  HOLDING_TYPE_DEFAULT,
} from '../../_shared/apis/enum';
import ROUTES from '../../_shared/constant/routes';
import { Amount } from '../../_shared/object';
import { DEFAULT_INVESTMENT_CURRENCY } from '../../_shared/util';
import { AmountText, BaseText, EarningText } from '../Text';
import { BaseChip, BaseRow } from '../View';
import { Icon } from '@rneui/themed';

const HoldingRow = ({
  holding_id: holdingID = '',
  holding_type: holdingType = HOLDING_TYPE_DEFAULT,
  account_id: accountID = '',
  symbol = '',
  total_shares: totalShares = 0,
  latest_value: latestValue = 0,
  currency = DEFAULT_INVESTMENT_CURRENCY,
  gain = 0,
  percent_gain: percentGain = 0,
  quote = { latest_price: 0, currency: 0, change_percent: 0 },
}) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const navigation = useNavigation();

  const onPress = () => {
    navigation.navigate(ROUTES.holdingForm, {
      account_id: accountID,
      holding_id: holdingID,
      symbol: symbol,
    });
  };

  const getPercentageChange = () => {
    return `(${Number(quote.change_percent).toFixed(2)}%)`;
  };

  const getPercentageChangeStyle = () => {
    if (quote.change_percent > 0) {
      return styles.positive;
    } else if (quote.change_percent < 0) {
      return styles.negative;
    }
    return styles.subInfo;
  };

  const getPercentageChangeArrow = () => {
    if (quote.change_percent > 0) {
      return 'arrowup';
    } else if (quote.change_percent < 0) {
      return 'arrowdown';
    }
    return '';
  };

  const renderHoldingInfo = () => {
    if (holdingType === HOLDING_TYPE_CUSTOM) {
      return <BaseChip>Custom</BaseChip>;
    } else if (holdingType === HOLDING_TYPE_DEFAULT) {
      return (
        <View>
          <View style={styles.stockInfo}>
            <View style={styles.rowSpacing}>
              <AmountText
                text5
                style={styles.subInfo}
                amount={new Amount(quote.latest_price, currency)}
              />
              <View style={styles.priceChange}>
                <BaseText text5 style={getPercentageChangeStyle()}>
                  {`  ${getPercentageChange()}`}
                </BaseText>
                {getPercentageChangeArrow() !== '' && (
                  <Icon
                    name={getPercentageChangeArrow()}
                    type="antdesign"
                    size={10}
                    color={getPercentageChangeStyle().color}
                  />
                )}
              </View>
            </View>
          </View>
          <BaseText text5 style={styles.subInfo}>
            {totalShares} {totalShares > 1 ? 'units' : 'unit'}
          </BaseText>
        </View>
      );
    }
  };

  return (
    <BaseRow onPress={onPress}>
      <View style={styles.leftContainer}>
        <View style={styles.rowSpacing}>
          <BaseText text3 numberOfLines={1}>
            {symbol}
          </BaseText>
        </View>

        <View>{renderHoldingInfo()}</View>
      </View>

      <View style={styles.rightContainer}>
        <View style={styles.rowSpacing}>
          <AmountText
            text3
            amount={new Amount(latestValue, currency)}
            sensitive
          />
        </View>

        <EarningText
          gain={new Amount(gain, currency)}
          percentGain={percentGain}
          text5
          style={styles.subInfo}
          sensitive
        />
      </View>
    </BaseRow>
  );
};

const getStyles = theme =>
  StyleSheet.create({
    subInfo: {
      color: theme.colors.color8,
    },
    leftContainer: {
      width: '40%',
    },
    rightContainer: {
      alignItems: 'flex-end',
    },
    stockInfo: {
      display: 'flex',
      flexDirection: 'row',
    },
    positive: {
      color: theme.colors.color1,
    },
    negative: {
      color: theme.colors.regularRed,
    },
    priceChange: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
    },
    rowSpacing: {
      marginBottom: 4,
      display: 'flex',
      flexDirection: 'row',
    },
  });

export default HoldingRow;
