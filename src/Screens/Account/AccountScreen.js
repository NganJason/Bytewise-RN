import { useNavigation } from '@react-navigation/native';
import { Icon, useTheme } from '@rneui/themed';
import {
  AmountText,
  BaseButton,
  BaseScreen2,
  BaseText,
  EmptyContent,
  BaseCard,
  BaseGrid,
  BaseImage,
  BaseLoadableView,
  BaseRow,
} from '../../Components';
import {
  ACCOUNT_TYPES,
  ACCOUNT_TYPE_BANK_ACCOUNT,
  ACCOUNT_TYPE_INVESTMENT,
  EQUITY_TYPE_ASSET,
  EQUITY_TYPE_DEBT,
} from '../../_shared/apis/enum';
import { loginHero } from '../../_shared/constant/asset';
import { EmptyContentConfig } from '../../_shared/constant/constant';
import ROUTES from '../../_shared/constant/routes';
import useDimension from '../../_shared/hooks/dimension';
import { capitalize } from '../../_shared/util/string';
const { View, StyleSheet } = require('react-native');

const MockData = [
  {
    account_id: '1',
    account_type: 3,
    equity_type: 1,
    account_name: 'Stock',
    amount: 8000,
  },
  {
    account_id: '2',
    account_type: 2,
    equity_type: 1,
    account_name: 'OCBC',
    amount: 5000,
  },
  {
    account_id: '4',
    account_type: 3,
    equity_type: 1,
    account_name: 'Syfe',
    amount: 13000,
  },
  {
    account_id: '5',
    account_type: 5,
    equity_type: 2,
    account_name: 'Student loan',
    amount: 21000,
  },
  {
    account_id: '6',
    account_type: 4,
    equity_type: 2,
    account_name: 'Citibank',
    amount: 3000,
  },
];

const AccountScreen = () => {
  const { theme } = useTheme();
  const { screenWidth, screenHeight } = useDimension();
  const styles = getStyles(theme, screenWidth, screenHeight);
  const navigation = useNavigation();

  const computeSum = () => {
    let assets = computeEquitySum(EQUITY_TYPE_ASSET);
    let debts = computeEquitySum(EQUITY_TYPE_DEBT);

    return assets - debts;
  };

  const computeEquitySum = (equityType = EQUITY_TYPE_ASSET) => {
    let sum = 0;
    MockData.map(d => {
      if (d.equity_type === equityType) {
        sum += d.amount;
      }
    });
    return sum;
  };

  const onAccountPress = account => {
    const { account_id = '', account_type = ACCOUNT_TYPE_BANK_ACCOUNT } =
      account;

    let route = ROUTES.accountBreakdown;
    if (account_type === ACCOUNT_TYPE_INVESTMENT) {
      route = ROUTES.InvestmentHolding;
    }

    navigation.navigate(route, {
      account_id: account_id,
    });
  };

  const renderContent = (equityType = EQUITY_TYPE_ASSET) => {
    let data = MockData.filter(d => d.equity_type === equityType);

    if (data.length === 0) {
      return (
        <EmptyContent
          item={EmptyContentConfig.asset}
          route={ROUTES.budgetForm}
        />
      );
    }

    return (
      <BaseGrid
        items={data}
        spacing={30}
        renderItem={item => (
          <BaseCard
            key={item.account_id}
            onPress={() => {
              onAccountPress(item);
            }}
            color={
              equityType === EQUITY_TYPE_ASSET
                ? theme.colors.color2
                : theme.colors.lightRed
            }>
            <BaseText text3 color={theme.colors.white}>
              {capitalize(item.account_name)}
            </BaseText>
            <AmountText
              text2
              color={theme.colors.white}
              margin={{ top: 16, bottom: 4 }}>
              {item.amount}
            </AmountText>
            <BaseText text4 color={theme.colors.white}>
              {capitalize(ACCOUNT_TYPES[item.account_type])}
            </BaseText>
          </BaseCard>
        )}
      />
    );
  };

  const renderHeader = () => {
    return (
      <>
        <View style={styles.title}>
          <BaseText h1>Accounts</BaseText>
          <AmountText h2 decimal={0} margin={{ top: 8, bottom: 2 }}>
            {computeSum()}
          </AmountText>
          <BaseButton
            title="Add account"
            type="clear"
            align="flex-start"
            size="sm"
            icon={
              <Icon
                name="plus-circle"
                type="feather"
                color={theme.colors.color1}
                size={13}
              />
            }
            onPress={() => {
              navigation.navigate(ROUTES.accountSelection);
            }}
          />
        </View>
        <BaseImage source={loginHero} containerStyle={styles.image} />
      </>
    );
  };

  return (
    <BaseScreen2
      headerProps={{
        component: renderHeader(),
        allowDrawer: true,
      }}>
      <BaseLoadableView scrollable={true}>
        <View>
          <BaseRow showDivider={false} disabled={true}>
            <BaseText h3>Assets</BaseText>
            <AmountText text3>{computeEquitySum(EQUITY_TYPE_ASSET)}</AmountText>
          </BaseRow>
          {renderContent(EQUITY_TYPE_ASSET)}
        </View>

        <View>
          <BaseRow showDivider={false} disabled={true}>
            <BaseText h3>Debts</BaseText>
            <AmountText text3>{computeEquitySum(EQUITY_TYPE_DEBT)}</AmountText>
          </BaseRow>
          {renderContent(EQUITY_TYPE_DEBT)}
        </View>
      </BaseLoadableView>
    </BaseScreen2>
  );
};

const getStyles = (_, screenWidth, screenHeight) =>
  StyleSheet.create({
    image: {
      width: screenHeight * 0.26,
      height: screenHeight * 0.26,
      position: 'absolute',
      right: screenWidth * -0.2,
    },
  });

export default AccountScreen;
