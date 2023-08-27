import { View, StyleSheet } from 'react-native';
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
import { capitalize, getEquityType } from '../../_shared/util';
import { useGetAccounts } from '../../_shared/query';
import { useError, useDimension } from '../../_shared/hooks';

const AccountScreen = () => {
  const { theme } = useTheme();
  const { screenWidth, screenHeight } = useDimension();
  const styles = getStyles(theme, screenWidth, screenHeight);
  const navigation = useNavigation();

  const getAccounts = useGetAccounts({});

  const computeSum = () => {
    let assets = computeEquitySum(EQUITY_TYPE_ASSET);
    let debts = computeEquitySum(EQUITY_TYPE_DEBT);
    return assets - debts;
  };

  const computeEquitySum = (equityType = EQUITY_TYPE_ASSET) => {
    const { accounts = [] } = getAccounts?.data || {};
    let sum = 0;

    accounts.map(d => {
      if (getEquityType(d.account_type) === equityType) {
        let amount = d.latest_value || d.balance;
        if (isNaN(amount)) {
          return;
        }
        sum += Number(amount);
      }
    });
    return Math.abs(sum);
  };

  const onAccountPress = account => {
    const { account_id = '', account_type = ACCOUNT_TYPE_BANK_ACCOUNT } =
      account;

    let route = ROUTES.accountBreakdown;
    if (account_type === ACCOUNT_TYPE_INVESTMENT) {
      route = ROUTES.investmentBreakdown;
    }

    navigation.navigate(route, {
      account_id: account_id,
      account_type: account_type,
    });
  };

  const renderContent = (equityType = EQUITY_TYPE_ASSET) => {
    const { accounts = [] } = getAccounts?.data || {};

    let items = accounts.filter(
      d => getEquityType(d.account_type) === equityType,
    );

    if (items.length === 0 && !getAccounts.isLoading) {
      return (
        <EmptyContent
          item={
            equityType === EQUITY_TYPE_ASSET
              ? EmptyContentConfig.asset
              : EmptyContentConfig.debt
          }
          route={ROUTES.accountSelection}
        />
      );
    }

    return (
      <BaseGrid
        items={items}
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
              {item.account_name}
            </BaseText>
            <AmountText
              text2
              showNegativeOnly={equityType === EQUITY_TYPE_ASSET}
              color={theme.colors.white}
              margin={{ top: 16, bottom: 4 }}>
              {item.latest_value || item.balance}
            </AmountText>
            <BaseText text4 color={theme.colors.white}>
              {capitalize(ACCOUNT_TYPES[item.account_type])}
            </BaseText>
          </BaseCard>
        )}
      />
    );
  };

  const renderContentV2 = (equityType = EQUITY_TYPE_ASSET) => {
    const { accounts = [] } = getAccounts?.data || {};
    let rows = [];

    let items = accounts.filter(
      d => getEquityType(d.account_type) === equityType,
    );

    if (items.length === 0 && !getAccounts.isLoading) {
      return (
        <EmptyContent
          item={
            equityType === EQUITY_TYPE_ASSET
              ? EmptyContentConfig.asset
              : EmptyContentConfig.debt
          }
          route={ROUTES.accountSelection}
        />
      );
    }

    items.map((item, idx) => {
      rows.push(
        <BaseRow
          key={idx}
          dividerMargin={0}
          onPress={() => {
            onAccountPress(item);
          }}>
          <View>
            <BaseText text3>{item.account_name}</BaseText>
            <BaseText text5 color={theme.colors.color8} margin={{ top: 4 }}>
              {capitalize(ACCOUNT_TYPES[item.account_type])}
            </BaseText>
          </View>
          <View style={styles.rowCol}>
            <AmountText text4>{item.latest_value || item.balance}</AmountText>
          </View>
        </BaseRow>,
      );
    });
    return rows;
  };

  const renderHeader = () => {
    return (
      <>
        <View style={styles.title}>
          <BaseText h1>Accounts</BaseText>
          <AmountText
            h2
            showNegativeOnly
            margin={{ top: 8, bottom: 2 }}
            isLoading={getAccounts.isLoading}>
            {computeSum()}
          </AmountText>
          <BaseButton
            title="Add Account"
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

  useError([getAccounts]);

  return (
    <BaseScreen2
      headerProps={{
        component: renderHeader(),
        allowDrawer: true,
      }}>
      <BaseLoadableView scrollable={true} isLoading={getAccounts.isLoading}>
        <View style={styles.contentContainer}>
          <BaseRow showDivider={false} disabled={true}>
            <BaseText h3>Assets</BaseText>
            <AmountText showNegativeOnly text3>
              {computeEquitySum(EQUITY_TYPE_ASSET)}
            </AmountText>
          </BaseRow>
          {renderContentV2(EQUITY_TYPE_ASSET)}
        </View>

        <View style={styles.contentContainer}>
          <BaseRow showDivider={false} disabled={true}>
            <BaseText h3>Debts</BaseText>
            <AmountText showNegativeOnly text3>
              {computeEquitySum(EQUITY_TYPE_DEBT)}
            </AmountText>
          </BaseRow>
          {renderContentV2(EQUITY_TYPE_DEBT)}
        </View>
      </BaseLoadableView>
    </BaseScreen2>
  );
};

const getStyles = (_, screenWidth, screenHeight) =>
  StyleSheet.create({
    contentContainer: {
      marginBottom: 30,
    },
    image: {
      width: screenHeight * 0.26,
      height: screenHeight * 0.26,
      position: 'absolute',
      right: screenWidth * -0.2,
      zIndex: -1,
    },
    rowCol: { justifyContent: 'center' },
  });

export default AccountScreen;
