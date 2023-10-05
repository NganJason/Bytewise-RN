import { useNavigation } from '@react-navigation/native';
import { useTheme } from '@rneui/themed';
import { StyleSheet, View } from 'react-native';
import ROUTES from '../../_shared/constant/routes';
import { Amount } from '../../_shared/object';
import {
  DEFAULT_CURRENCY,
  getDateStringFromTs,
  getTotalInvestmentCost,
} from '../../_shared/util';
import { AmountText, BaseText } from '../Text';
import { BaseRow } from '../View';

const LotRow = ({
  account_id: accountID = '',
  holding_id: holdingID = '',
  lot_id: lotID = '',
  symbol = '',
  currency = DEFAULT_CURRENCY,
  shares = 0,
  cost_per_share: costPerShare = 0,
  trade_date: tradeDate = '',
}) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const navigation = useNavigation();

  return (
    <BaseRow
      onPress={() => {
        navigation.navigate(ROUTES.lotForm, {
          account_id: accountID,
          holding_id: holdingID,
          symbol: symbol,
          lot_id: lotID,
        });
      }}>
      <View>
        <BaseText text3>{shares} units</BaseText>
        <BaseText text5 color={theme.colors.color8} margin={{ top: 4 }}>
          {getDateStringFromTs(tradeDate)}
        </BaseText>
      </View>

      <View style={styles.rightContainer}>
        <AmountText
          text3
          amount={
            new Amount(getTotalInvestmentCost(shares, costPerShare), currency)
          }
          sensitive
        />
        <AmountText
          text5
          amount={new Amount(costPerShare, currency)}
          color={theme.colors.color8}
          margin={{ top: 4 }}
          suffix="/unit"
        />
      </View>
    </BaseRow>
  );
};

const getStyles = _ =>
  StyleSheet.create({
    rightContainer: {
      alignItems: 'flex-end',
    },
  });

export default LotRow;
