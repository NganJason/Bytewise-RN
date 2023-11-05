import React, { useContext } from 'react';
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
import {
  capitalize,
  getEquityType,
  isAccountTypeAsset,
  isAccountTypeDebt,
} from '../../_shared/util';
import { useGetAccounts } from '../../_shared/query';
import { useError, useDimension } from '../../_shared/hooks';
import AccountCharts from './AccountCharts';
import { Amount } from '../../_shared/object';
import { UserMetaContext } from '../../_shared/context/UserMetaContext';

const AccountScreen = () => {
  const { theme } = useTheme();
  const { screenWidth, screenHeight } = useDimension();
  const styles = getStyles(theme, screenWidth, screenHeight);
  const navigation = useNavigation();

  const { getUserBaseCurrency } = useContext(UserMetaContext);

  const getAccounts = useGetAccounts({});
  const {
    net_worth: netWorth = 0,
    currency = getUserBaseCurrency(),
    asset_value: assetValue,
    debt_value: debtValue,
  } = getAccounts?.data || {};

  const onAccountPress = account => {
    const {
      account_id: accountID = '',
      account_type: accountType = ACCOUNT_TYPE_BANK_ACCOUNT,
    } = account;

    let route = ROUTES.accountBreakdown;
    if (accountType === ACCOUNT_TYPE_INVESTMENT) {
      route = ROUTES.investmentBreakdown;
    }

    navigation.navigate(route, {
      account_id: accountID,
      account_type: accountType,
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
      let amount = new Amount(item.latest_value || item.balance, item.currency);
      rows.push(
        <BaseRow
          key={idx}
          dividerMargin={0}
          onPress={() => {
            onAccountPress(item);
          }}>
          <View style={styles.infoCol}>
            <BaseText text3 numberOfLines={1}>
              {item.account_name}
            </BaseText>
            <BaseText text5 color={theme.colors.color8} margin={{ top: 4 }}>
              {capitalize(ACCOUNT_TYPES[item.account_type])}
            </BaseText>
          </View>
          <View style={styles.amountCol}>
            <AmountText
              text4
              amount={amount}
              showNegativeOnly={isAccountTypeAsset(item.account_type)}
              showPositiveOnly={isAccountTypeDebt(item.account_type)}
              sensitive
            />
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
            amount={new Amount(netWorth, currency)}
            showNegativeOnly
            margin={{ top: 8, bottom: 2 }}
            isLoading={getAccounts.isLoading}
            sensitive
          />

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
            <AmountText
              text3
              amount={new Amount(assetValue, currency)}
              showNegativeOnly
              sensitive
            />
          </BaseRow>
          {renderContent(EQUITY_TYPE_ASSET)}
        </View>

        <View style={styles.contentContainer}>
          <BaseRow showDivider={false} disabled={true}>
            <BaseText h3>Debts</BaseText>
            <AmountText
              text3
              amount={new Amount(debtValue, currency)}
              showPositiveOnly
              sensitive
            />
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
        allowHideInfo: true,
      }}
      enablePadding={false}
      fabProps={{
        show: true,
        placement: 'right',
        iconName: 'plus',
        iconType: 'entypo',
        iconColor: theme.colors.white,
        color: theme.colors.color1,
        onPress: () => navigation.navigate(ROUTES.accountSelection),
      }}>
      <BaseSwipeableView
        items={[
          renderAccountOverview(),
          <AccountCharts
            accounts={getAccounts?.data?.accounts || []}
            assetSum={new Amount(assetValue, currency)}
            debtSum={new Amount(debtValue, currency)}
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
    amountCol: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'flex-end',
    },
    infoCol: {
      flex: 2,
    },
  });

export default AccountScreen;
