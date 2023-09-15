import { useNavigation } from '@react-navigation/native';
import { useTheme } from '@rneui/themed';
import { StyleSheet, View } from 'react-native';
import ROUTES from '../../_shared/constant/routes';
import {
  CURRENCY_USD,
  getDateStringFromTs,
  getTotalInvestmentCost,
} from '../../_shared/util';
import { AmountText, BaseText } from '../Text';
import { BaseRow } from '../View';

const LotRow = ({
  account_id = '',
  holding_id = '',
  lot_id = '',
  shares = 0,
  cost_per_share = 0,
  trade_date = '',
  symbol = '',
}) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const navigation = useNavigation();

  return (
    <BaseRow
      onPress={() => {
        navigation.navigate(ROUTES.lotForm, {
          account_id: account_id,
          holding_id: holding_id,
          symbol: symbol,
          lot_id: lot_id,
        });
      }}>
      <View>
        <BaseText text3>{shares} units</BaseText>
        <BaseText text5 color={theme.colors.color8} margin={{ top: 4 }}>
          {getDateStringFromTs(trade_date)}
        </BaseText>
      </View>

      <View style={styles.rightContainer}>
        <AmountText text3 currency={CURRENCY_USD}>
          {getTotalInvestmentCost(shares, cost_per_share)}
        </AmountText>
        <AmountText
          text5
          color={theme.colors.color8}
          margin={{ top: 4 }}
          currency={CURRENCY_USD}
          suffix="/unit">
          {cost_per_share}
        </AmountText>
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
