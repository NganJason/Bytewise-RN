import { useNavigation } from '@react-navigation/native';
import { StyleSheet, View } from 'react-native';
import { useTheme } from '@rneui/themed';
import { useContext } from 'react';
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
import { useGetMetrics } from '../../_shared/query';
import {
  parseDateStringWithoutDelim,
  getYearMonthString,
} from '../../_shared/util';
import {
  AmountText,
  BaseHoriScrollableItems,
  BaseLoadableView,
  BaseText,
  LineChartWithGranularity,
} from '../../Components';
import { Amount } from '../../_shared/object';
import { Metrics, Title } from './common';
import { useAccounts, useError, useNetWorthGraph } from '../../_shared/hooks';

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
  const styles = getStyles(theme);
  const {
    changeGranularity,
    granularityIdx,
    getSummaryData,
    getCurrDataPoint,
    setCurrDataPoint,
    resetCurrDataPoint,
    getErrors,
    isLoading,
  } = useNetWorthGraph(granularities, 1);
  const {
    sum = 0,
    currency = '',
    date = '',
    percent_change: percent = null,
    absolute_change: absChange = 0,
  } = getCurrDataPoint();

  const renderPercentChange = () => {
    let color;
    let text;

    if (percent === null) {
      text = '(N/A)';
    } else {
      let val = Number(Math.abs(percent) || 0).toFixed(2);
      text = `(${val}%)`;
    }

    if (Number(absChange) === 0) {
      color = theme.colors.color7;
    } else if (Number(absChange) > 0) {
      color = theme.colors.color1;
    } else {
      color = theme.colors.regularRed;
    }

    return (
      <View style={styles.percentChange}>
        <AmountText
          text5
          color={color}
          amount={new Amount(absChange, currency)}
          showSign
        />
        <BaseText text5 color={color} margin={{ horizontal: 4 }}>
          {text}
        </BaseText>
      </View>
    );
  };

  useError(getErrors());

  return (
    <View>
      <AmountText
        h1
        sensitive
        showNegativeOnly
        amount={new Amount(sum, currency)}
        margin={{ top: 10 }}
        color={theme.colors.color6}
      />

      <View>
        {renderPercentChange()}
        <BaseText text5 color={theme.colors.color7}>
          {getYearMonthString(parseDateStringWithoutDelim(date))}
        </BaseText>
      </View>

      <LineChartWithGranularity
        chartHeight={height}
        onTouchEnd={() => {
          setTimeout(() => {
            resetCurrDataPoint();
          }, 200);
        }}
        handleActiveData={e => {
          setCurrDataPoint(e);
        }}
        data={getSummaryData()}
        granularities={granularities}
        onGranularityChange={changeGranularity}
        granularityIdx={granularityIdx}
        isDataLoading={isLoading}
      />
    </View>
  );
};

const NetWorthInsight = () => {
  const navigation = useNavigation();
  const {
    getSortedAssetAccounts,
    getSortedDebtAccounts,
    isLoading: isAccountsLoading,
    getErrors,
  } = useAccounts();

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

  const isLoading = getMetrics.isLoading || isAccountsLoading;
  useError([...getErrors(), getMetrics]);

  return (
    <BaseLoadableView isLoading={isLoading}>
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

const getStyles = _ =>
  StyleSheet.create({
    percentChange: {
      flexDirection: 'row',
      marginVertical: 5,
    },
  });

export { NetWorthGraph, NetWorthInsight };
