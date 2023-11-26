import { useNavigation } from '@react-navigation/native';
import { StyleSheet, View } from 'react-native';
import { useTheme } from '@rneui/themed';
import { useContext, useState } from 'react';
import {
  ACCOUNT_TYPES,
  ACCOUNT_TYPE_BANK_ACCOUNT,
  ACCOUNT_TYPE_INVESTMENT,
  METRIC_TYPE_NET_WORTH,
} from '../../_shared/apis/enum';
import ROUTES from '../../_shared/constant/routes';
import { UserMetaContext } from '../../_shared/context';
import {
  useGetAccounts,
  useGetAccountsSummary,
  useGetMetrics,
} from '../../_shared/query';
import { isAccountTypeAsset, isAccountTypeDebt } from '../../_shared/util';
import {
  AmountText,
  BaseHoriScrollableItems,
  BaseLineChart,
  BaseLoadableView,
  BaseText,
} from '../../Components';
import { Amount } from '../../_shared/object';
import { Metrics, Title } from './common';

const NetWorthGraph = () => {
  const [value, setValue] = useState(0);
  const getAccountsSummary = useGetAccountsSummary({ unit: 1, interval: 3 });

  const parseSummaryData = () => {
    const data = getAccountsSummary?.data?.net_worth || [];
    return data.map(d => ({ ...d, value: d.sum }));
  };

  return (
    <View>
      <AmountText h2 amount={new Amount(value)} margin={{ vertical: 10 }} />
      <BaseLineChart
        chartHeight={100}
        handleActiveData={e => setValue(e.value)}
        data={parseSummaryData()}
      />
    </View>
  );
};

const EquityInsight = () => {
  const navigation = useNavigation();

  const getAccounts = useGetAccounts({});
  const { accounts = [] } = getAccounts?.data || {};

  const getMetrics = useGetMetrics({ metric_type: METRIC_TYPE_NET_WORTH });
  const parseMetrics = () => {
    const data = getMetrics?.data?.metrics || [];
    return data;
  };

  const getSortedAssetAccounts = () => {
    let assetAccounts = accounts.filter(d =>
      isAccountTypeAsset(d?.account_type || 0),
    );
    assetAccounts.sort((a, b) => b.balance - a.balance);
    return assetAccounts;
  };

  const getSortedDebtAccounts = () => {
    let debtAccounts = accounts.filter(d =>
      isAccountTypeDebt(d?.account_type || 0),
    );
    return debtAccounts.sort((a, b) => a.balance - b.balance);
  };

  const onAddAccount = () => {
    navigation.navigate(ROUTES.accountSelection);
  };

  const onAccountPress = (account = {}) => {
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

  const renderAccountItem = (account = {}) => {
    return <AccountItem account={account} />;
  };

  return (
    <BaseLoadableView>
      <Title>Metrics</Title>
      <Metrics items={parseMetrics()} />

      <Title>Assets</Title>
      <BaseHoriScrollableItems
        onAdd={onAddAccount}
        onPress={onAccountPress}
        items={getSortedAssetAccounts()}
        renderItem={renderAccountItem}
      />

      <Title>Debts</Title>
      <BaseHoriScrollableItems
        onAdd={onAddAccount}
        onPress={onAccountPress}
        items={getSortedDebtAccounts()}
        renderItem={renderAccountItem}
      />
    </BaseLoadableView>
  );
};

const AccountItem = ({ account = {} }) => {
  const { theme } = useTheme();
  const { getUserBaseCurrency } = useContext(UserMetaContext);

  const {
    account_name: accountName = '',
    account_type: accountType = ACCOUNT_TYPE_BANK_ACCOUNT,
    balance = 0,
    currency: accountCurrency = getUserBaseCurrency(),
  } = account;

  return (
    <>
      <BaseText text3 numberOfLines={1} color={theme.colors.color6}>
        {accountName}
      </BaseText>
      <BaseText
        text5
        color={theme.colors.color8}
        margin={{ top: 4 }}
        numberOfLines={1}>
        {ACCOUNT_TYPES[accountType]}
      </BaseText>
      <AmountText
        text4
        margin={{ top: 8 }}
        color={theme.colors.color7}
        sensitive
        amount={new Amount(balance, accountCurrency)}
      />
    </>
  );
};

const getStyles = theme =>
  StyleSheet.create({
    aggr: {
      marginTop: 4,
      marginBottom: 6,
    },
  });

export { NetWorthGraph, EquityInsight };
