import { useNavigation } from '@react-navigation/native';
import { StyleSheet, View } from 'react-native';
import { useTheme } from '@rneui/themed';
import { useCallback, useContext, useEffect, useState } from 'react';
import {
  ACCOUNT_TYPES,
  ACCOUNT_TYPE_BANK_ACCOUNT,
  ACCOUNT_TYPE_INVESTMENT,
  EQUITY_TYPE_ASSET,
  EQUITY_TYPE_DEBT,
  METRIC_TYPE_NET_WORTH,
} from '../../_shared/apis/enum';
import ROUTES from '../../_shared/constant/routes';
import { UserMetaContext } from '../../_shared/context';
import { useGetAccountsSummary, useGetMetrics } from '../../_shared/query';
import {
  parseDateStringWithoutDelim,
  getYearMonthString,
} from '../../_shared/util';
import {
  AmountText,
  BaseHoriScrollableItems,
  BaseLineChart,
  BaseLoadableView,
  BaseText,
} from '../../Components';
import { Amount } from '../../_shared/object';
import { Metrics, Title } from './common';
import { useAccounts } from '../../_shared/hooks';

const threeM = '3M';
const sixM = '6M';
const oneY = '1Y';
const granularities = [
  { name: threeM, val: 3 },
  { name: sixM, val: 6 },
  { name: oneY, val: 12 },
];

const NetWorthGraph = ({ height = 0 }) => {
  const { theme } = useTheme();

  // We are not using object
  // because it will cause inifinite state update in BaseLineChart
  const [currSum, setCurrSum] = useState(0);
  const [currDate, setCurrDate] = useState(getYearMonthString());

  const [granularityIdx, setGranularityIdx] = useState(1);
  const onGranularityChange = idx => {
    setGranularityIdx(idx);
  };

  const getAccountsSummary = useGetAccountsSummary({
    unit: 1,
    interval: granularities[granularityIdx].val,
  });

  const parseSummaryData = () => {
    const data = getAccountsSummary?.data?.net_worth || [];
    return data.map(d => ({ ...d, value: d.sum }));
  };

  useEffect(() => {
    resetCurrSummary();
  }, [resetCurrSummary, getAccountsSummary.data]);

  const resetCurrSummary = useCallback(() => {
    const data = getAccountsSummary?.data?.net_worth || [];
    const { sum = 0, date = '' } = data[data.length - 1] || {};
    setCurrDataPoint(sum, date);
  }, [getAccountsSummary.data]);

  const setCurrDataPoint = (sum = 0, dateStrWithoutDelimi = '') => {
    setCurrSum(sum);
    setCurrDate(
      getYearMonthString(parseDateStringWithoutDelim(dateStrWithoutDelimi)),
    );
  };

  return (
    <View>
      <AmountText
        h1
        sensitive
        amount={new Amount(currSum)}
        margin={{ top: 10, bottom: 5 }}
        color={theme.colors.color6}
      />
      <BaseText text5 color={theme.colors.color7}>
        {currDate}
      </BaseText>
      <BaseLineChart
        onTouchEnd={() => {
          setTimeout(() => {
            resetCurrSummary();
          }, 200);
        }}
        chartHeight={height}
        handleActiveData={e => {
          setCurrDataPoint(e.sum, e.date);
        }}
        data={parseSummaryData()}
        granularities={granularities}
        onGranularityChange={onGranularityChange}
        granularityIdx={granularityIdx}
      />
    </View>
  );
};

const NetWorthInsight = () => {
  const navigation = useNavigation();
  const { getSortedAssetAccounts, getSortedDebtAccounts } = useAccounts();

  const getMetrics = useGetMetrics({ metric_type: METRIC_TYPE_NET_WORTH });
  const parseMetrics = () => {
    const data = getMetrics?.data?.metrics || [];
    return data;
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

      <Title
        onPress={() =>
          navigation.navigate(ROUTES.accountOverview, {
            type: EQUITY_TYPE_ASSET,
          })
        }>
        Assets
      </Title>
      <BaseHoriScrollableItems
        onAdd={onAddAccount}
        onPress={onAccountPress}
        items={getSortedAssetAccounts()}
        renderItem={renderAccountItem}
      />

      <Title
        onPress={() =>
          navigation.navigate(ROUTES.accountOverview, {
            type: EQUITY_TYPE_DEBT,
          })
        }>
        Debts
      </Title>
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

const getStyles = theme => StyleSheet.create({});

export { NetWorthGraph, NetWorthInsight };
