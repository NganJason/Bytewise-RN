import { useNavigation } from '@react-navigation/native';
import { Icon, useTheme } from '@rneui/themed';
import { StyleSheet, View } from 'react-native';
import useDimension from '../../../_shared/hooks/dimension';
import { EmptyContentConfig } from '../../../_shared/constant/constant';
import { graph } from '../../../_shared/constant/asset';
import ROUTES from '../../../_shared/constant/routes';
import {
  AmountText,
  BaseImage,
  BaseText,
  BaseButton,
  BaseScreen2,
  EarningText,
  BaseLoadableView,
  EmptyContent,
  InvestmentHolding,
} from '../../../Components';
import { capitalize } from '../../../_shared/util/string';

const mockData = {
  account_id: '1',
  account_name: 'stocks',
  amount: 21000,
  cost: 19000,
  holdings: [
    {
      holding_id: '1',
      symbol: 'AAPL',
      amount: 2000,
      cost: 2100,
      unit: 10,
    },
    {
      holding_id: '2',
      symbol: 'MSFT',
      amount: 1800,
      cost: 1300,
      unit: 21.5,
    },
    {
      holding_id: '3',
      symbol: 'VTI',
      amount: 12000,
      cost: 11000,
      unit: 43.5,
    },
  ],
};

const InvestmentBreakdownScreen = ({ route }) => {
  const { theme } = useTheme();
  const { screenWidth, screenHeight } = useDimension();
  const styles = getStyles(theme, screenWidth, screenHeight);
  const navigation = useNavigation();

  const account_id = route.params?.account_id || '';

  const renderRows = () => {
    let rows = [];
    const { holdings } = mockData || {};

    holdings.map(d => {
      rows.push(<InvestmentHolding key={d.holding_id} holding={d} />);
    });

    if (rows.length === 0) {
      return (
        <EmptyContent
          item={EmptyContentConfig.investment}
          route={ROUTES.transactionForm}
          marginVertical="30%"
        />
      );
    }

    return rows;
  };

  const renderHeader = () => {
    return (
      <>
        <View style={styles.title}>
          <BaseText h1>{capitalize(mockData.account_name)}</BaseText>
          <AmountText
            style={styles.titleText}
            h2
            decimal={0}
            margin={{ top: 8 }}>
            {mockData.amount}
          </AmountText>
          <EarningText
            currVal={mockData.amount}
            initialVal={mockData.cost}
            text5
            margin={{ vertical: 2 }}
          />
          <BaseText text4>Investment</BaseText>
        </View>
        <BaseImage source={graph} containerStyle={styles.image} />
      </>
    );
  };

  return (
    <BaseScreen2
      headerProps={{
        component: renderHeader(),
        allowBack: true,
        backgroundColor: theme.colors.color13,
      }}>
      <View style={styles.body}>
        <BaseText h3>Holdings</BaseText>
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
      </View>
    </BaseScreen2>
  );
};

const getStyles = (theme, screenWidth, screenHeight) =>
  StyleSheet.create({
    image: {
      width: screenHeight * 0.2,
      height: screenHeight * 0.18,
      position: 'absolute',
      right: screenWidth * -0.12,
    },
    body: {
      paddingVertical: theme.spacing.lg,
    },
  });

export default InvestmentBreakdownScreen;
