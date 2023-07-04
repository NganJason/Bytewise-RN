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
  HoldingBreakdown,
} from '../../../Components';
import { EmptyContentConfig } from '../../../_shared/constant/constant';
import ROUTES from '../../../_shared/constant/routes';

const mockData = {
  holding_id: '1',
  symbol: 'VTI',
  amount: 21000,
  cost: 20000,
  unit: 10.3184,
  wac: 23.09,
  breakdown: [
    {
      share_id: '1',
      unit: 140,
      date: '12-06-2023',
      amount: 3000,
      cost_per_unit: 20,
    },
    {
      share_id: '2',
      unit: 52.3,
      date: '27-04-2023',
      amount: 1000,
      cost_per_unit: 22,
    },
    {
      share_id: '3',
      unit: 31.7,
      date: '03-04-2023',
      amount: 500,
      cost_per_unit: 15,
    },
  ],
};

const HoldingBreakdownScreen = ({}) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const navigation = useNavigation();

  const renderRows = () => {
    let rows = [];
    let { breakdown = [] } = mockData || {};

    breakdown.map(d => {
      rows.push(<HoldingBreakdown key={d.share_id} share={d} />);
    });

    if (rows.length === 0) {
      return (
        <EmptyContent
          item={EmptyContentConfig.investment}
          route={ROUTES.investmentForm}
          marginVertical="30%"
        />
      );
    }

    return rows;
  };

  const renderHeader = () => {
    return (
      <>
        <BaseText h1>{mockData.symbol.toUpperCase()}</BaseText>
        <BaseText text5 margin={{ top: 8, bottom: 4 }}>
          Current value
        </BaseText>
        <AmountText
          style={styles.titleText}
          h2
          decimal={0}
          margin={{ bottom: 8 }}>
          {mockData.amount}
        </AmountText>

        <View style={styles.headerRow}>
          <BaseText text5>Invested amount</BaseText>
          <AmountText text5>{mockData.cost}</AmountText>
        </View>

        <View style={styles.headerRow}>
          <BaseText text5>Profit/Loss</BaseText>
          <EarningText
            currVal={mockData.amount}
            initialVal={mockData.cost}
            text5
          />
        </View>

        <View style={styles.headerRow}>
          <BaseText text5>Quantity</BaseText>
          <BaseText text5>{mockData.unit}</BaseText>
        </View>

        <View style={styles.headerRow}>
          <BaseText text5>WAC</BaseText>
          <AmountText text5>{mockData.wac}</AmountText>
        </View>
      </>
    );
  };

  return (
    <BaseScreen3 headerProps={{ allowBack: true, component: renderHeader() }}>
      <>
        <BaseText h3>History</BaseText>
        <BaseButton
          title="Add holding"
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
            navigation.navigate(ROUTES.investmentForm);
          }}
        />
        <BaseLoadableView scrollable={true}>{renderRows()}</BaseLoadableView>
      </>
    </BaseScreen3>
  );
};

const getStyles = theme =>
  StyleSheet.create({
    headerRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginVertical: theme.spacing.xs,
    },
  });

export default HoldingBreakdownScreen;
