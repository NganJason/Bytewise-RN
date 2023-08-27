import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Icon, useTheme } from '@rneui/themed';
import {
  AmountText,
  BaseButton,
  BaseScreen2,
  BaseText,
  EmptyContent,
  BaseImage,
  BaseLoadableView,
  BaseRow,
  BaseSwipeableView,
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
import AccountCharts from './AccountCharts';

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

  const renderAccountOverview = () => {
    return (
      <BaseLoadableView
        scrollable={true}
        isLoading={getAccounts.isLoading}
        containerStyle={styles.body}>
        <View style={styles.contentContainer}>
          <BaseRow showDivider={false} disabled={true}>
            <BaseText h3>Assets</BaseText>
            <AmountText showNegativeOnly text3>
              {computeEquitySum(EQUITY_TYPE_ASSET)}
            </AmountText>
          </BaseRow>
          {renderContent(EQUITY_TYPE_ASSET)}
        </View>

        <View style={styles.contentContainer}>
          <BaseRow showDivider={false} disabled={true}>
            <BaseText h3>Debts</BaseText>
            <AmountText showNegativeOnly text3>
              {computeEquitySum(EQUITY_TYPE_DEBT)}
            </AmountText>
          </BaseRow>
          {renderContent(EQUITY_TYPE_DEBT)}
        </View>
      </BaseLoadableView>
    );
  };

  useError([getAccounts]);

  return (
    <BaseScreen2
      headerProps={{
        component: renderHeader(),
        allowDrawer: true,
      }}
      enablePadding={false}>
      <BaseSwipeableView
        items={[
          renderAccountOverview(),
          <AccountCharts
            accounts={getAccounts?.data?.accounts || []}
            assetSum={computeEquitySum(EQUITY_TYPE_ASSET)}
            debtSum={computeEquitySum(EQUITY_TYPE_DEBT)}
            onAccountPress={onAccountPress}
          />,
        ]}
        enableDotIndicator
      />
    </BaseScreen2>
  );
};

const getStyles = (_, screenWidth, screenHeight) =>
  StyleSheet.create({
    body: {
      paddingHorizontal: 26,
    },
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
