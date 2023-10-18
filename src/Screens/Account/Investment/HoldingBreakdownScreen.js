import { useNavigation } from '@react-navigation/native';
import { Icon, useTheme } from '@rneui/themed';
import { View } from 'react-native';
import { StyleSheet } from 'react-native';
import {
  BaseScreen3,
  BaseText,
  EmptyContent,
  BaseLoadableView,
  AmountText,
  EarningText,
  BaseButton,
  LotRow,
  InfoToolTip,
} from '../../../Components';
import { EmptyContentConfig } from '../../../_shared/constant/constant';
import { genStockUpdateTimeMsg } from '../../../_shared/constant/message';
import ROUTES from '../../../_shared/constant/routes';
import { Amount } from '../../../_shared/object';
import { useGetHolding, useGetLots } from '../../../_shared/query';
import {
  DEFAULT_INVESTMENT_CURRENCY,
  tsToDateTimeStr,
} from '../../../_shared/util';

const HoldingBreakdownScreen = ({ route }) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const navigation = useNavigation();
  const {
    holding_id: holdingID = '',
    account_id: accountID = '',
    symbol = '',
  } = route?.params || {};

  const getHolding = useGetHolding({ holding_id: holdingID });
  const {
    latest_value: latestValue = 0,
    total_cost: totalCost = 0,
    total_shares: totalShares = 0,
    avg_cost_per_share: avgCostPerShare = 0,
    gain = 0,
    percent_gain: percentGain = 0,
    currency = DEFAULT_INVESTMENT_CURRENCY,
    quote = {
      latest_price: 0,
      update_time: 0,
    },
  } = getHolding?.data?.holding || {};

  const getLots = useGetLots({ holding_id: holdingID });

  const isScreenLoading = () => {
    getHolding.isLoading || getLots.isLoading;
  };

  const renderRows = () => {
    let rows = [];
    let lots = getLots?.data?.lots || [];
    lots.sort((a, b) => b.trade_date - a.trade_date);

    lots.map(lot => {
      rows.push(
        <LotRow
          key={lot.lot_id}
          account_id={accountID}
          symbol={symbol}
          {...lot}
        />,
      );
    });

    if (rows.length === 0) {
      return (
        <EmptyContent
          item={EmptyContentConfig.unit}
          route={ROUTES.lotForm}
          routeParam={{
            account_id: accountID,
            holding_id: holdingID,
            symbol: symbol,
          }}
        />
      );
    }

    return rows;
  };

  const renderHeader = () => {
    return (
      <>
        <View style={styles.symbol}>
          <BaseText h1 margin={{ right: 15 }}>
            {symbol.toUpperCase()}
          </BaseText>
          <InfoToolTip
            iconSize={18}
            message={genStockUpdateTimeMsg(tsToDateTimeStr(quote.update_time))}
          />
        </View>
        <BaseText text5 margin={{ top: 8, bottom: 4 }}>
          Current value
        </BaseText>
        <AmountText
          h2
          style={styles.titleText}
          amount={new Amount(latestValue, currency)}
          margin={{ bottom: 8 }}
          isLoading={getHolding.isLoading}
          loadingLen={10}
          sensitive
        />
        <View style={styles.headerRow}>
          <BaseText text5>Invested amount</BaseText>
          <AmountText
            text5
            amount={new Amount(totalCost, currency)}
            isLoading={getHolding.isLoading}
            sensitive
          />
        </View>

        <View style={styles.headerRow}>
          <BaseText text5>Profit/Loss</BaseText>
          <EarningText
            text5
            gain={new Amount(gain, currency)}
            percentGain={percentGain}
            isLoading={getHolding.isLoading}
          />
        </View>

        <View style={styles.headerRow}>
          <BaseText text5>Quantity</BaseText>
          <BaseText text5 isLoading={getHolding.isLoading}>
            {totalShares} {totalShares > 1 ? 'units' : 'unit'}
          </BaseText>
        </View>

        <View style={styles.headerRow}>
          <BaseText text5>Latest price</BaseText>
          <AmountText
            text5
            amount={new Amount(quote.latest_price, quote.currency)}
            isLoading={getHolding.isLoading}
          />
        </View>

        <View style={styles.headerRow}>
          <BaseText text5>WAC</BaseText>
          <AmountText
            text5
            amount={new Amount(avgCostPerShare, currency)}
            isLoading={getHolding.isLoading}
          />
        </View>
      </>
    );
  };

  return (
    <BaseScreen3 headerProps={{ allowBack: true, component: renderHeader() }}>
      <>
        <BaseText h3>History</BaseText>
        <BaseButton
          title="Add Units"
          type="clear"
          align="flex-start"
          size="sm"
          icon={
            <Icon
              name="plus-circle"
              type="feather"
              color={theme.colors.color1}
              size={13}
              iconStyle={styles.icon}
            />
          }
          onPress={() => {
            navigation.navigate(ROUTES.lotForm, {
              account_id: accountID,
              holding_id: holdingID,
              symbol: symbol,
            });
          }}
        />
        <BaseLoadableView scrollable={true} isLoading={isScreenLoading()}>
          {renderRows()}
        </BaseLoadableView>
      </>
    </BaseScreen3>
  );
};

const getStyles = theme =>
  StyleSheet.create({
    symbol: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    headerRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginVertical: theme.spacing.xs,
    },
  });

export default HoldingBreakdownScreen;
