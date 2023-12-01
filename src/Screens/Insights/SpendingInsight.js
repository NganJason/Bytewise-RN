import { useNavigation } from '@react-navigation/native';
import { useTheme } from '@rneui/themed';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import {
  AmountText,
  BaseHoriScrollableItems,
  BaseLineChart,
  BaseLoadableView,
  BaseText,
} from '../../Components';
import { METRIC_TYPE_SAVINGS } from '../../_shared/apis/enum';
import ROUTES from '../../_shared/constant/routes';
import {
  useCategoriesSum,
  useError,
  useTransactionGroups,
} from '../../_shared/hooks';
import { Amount } from '../../_shared/object';
import { useGetMetrics } from '../../_shared/query';
import { useGetTransactionsSummary } from '../../_shared/query/transaction';
import {
  getYearMonthString,
  parseDateStringWithoutDelim,
} from '../../_shared/util';
import { Metrics, Title } from './common';

const threeM = '3M';
const sixM = '6M';
const oneY = '1Y';
const granularities = [
  { name: threeM, val: 3 },
  { name: sixM, val: 6 },
  { name: oneY, val: 12 },
];

const SpendingGraph = ({ height = 0 }) => {
  const { theme } = useTheme();
  // We are not using object
  // because it will cause inifinite state update in BaseLineChart
  const [currSavings, setCurrSavings] = useState(0);
  const [currDate, setCurrDate] = useState(getYearMonthString());

  const [granularityIdx, setGranularityIdx] = useState(1);
  const onGranularityChange = idx => {
    setGranularityIdx(idx);
  };

  const getTransactionsSummary = useGetTransactionsSummary({
    unit: 1,
    interval: granularities[granularityIdx].val,
  });
  const summaries = useMemo(
    () => getTransactionsSummary?.data?.summary || [],
    [getTransactionsSummary],
  );

  const parseSummaryData = () => {
    return summaries.map(d => ({ ...d, value: d.sum }));
  };

  useEffect(() => {
    resetCurrSummary();
  }, [resetCurrSummary, summaries]);

  const resetCurrSummary = useCallback(() => {
    const { sum = 0, date = '' } = summaries[summaries.length - 1] || {};
    setCurrDataPoint(sum, date);
  }, [summaries]);

  const setCurrDataPoint = (sum = 0, dateStrWithoutDelimi = '') => {
    setCurrSavings(sum);
    setCurrDate(
      getYearMonthString(parseDateStringWithoutDelim(dateStrWithoutDelimi)),
    );
  };

  return (
    <View>
      <AmountText
        h1
        sensitive
        showNegativeOnly
        amount={new Amount(currSavings)}
        margin={{ vertical: 10 }}
      />
      <BaseText text5 color={theme.colors.color7}>
        {currDate}
      </BaseText>
      <BaseLineChart
        chartHeight={height}
        handleActiveData={e => setCurrDataPoint(e.sum, e.date)}
        data={parseSummaryData()}
        granularities={granularities}
        onGranularityChange={onGranularityChange}
        granularityIdx={granularityIdx}
      />
    </View>
  );
};

const SpendingInsight = () => {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const navigation = useNavigation();

  const [activeDate] = useState(new Date());
  const {
    timeRange,

    getErrors: getTransactionErrors,
    isLoading: isTransactionLoading,
  } = useTransactionGroups(activeDate);

  const {
    getSortedExpenseCategoriesSum,
    getSortedIncomeCategoriesSum,
    getErrors: getCategoriesSumErrors,
    isLoading: isCategoriesSumLoading,
  } = useCategoriesSum(timeRange);

  const getMetrics = useGetMetrics({ metric_type: METRIC_TYPE_SAVINGS });
  const parseMetrics = () => {
    const data = getMetrics?.data?.metrics || [];
    return data;
  };

  const renderSpendingItem = (category = {}) => {
    return <SpendingItem category={category} />;
  };

  const onAddCategory = () => {
    navigation.navigate(ROUTES.categoryForm);
  };

  const onCategoryPress = (category = {}) => {
    const { category_id: categoryID = '' } = category;
    navigation.navigate(ROUTES.categoryBreakdown, { category_id: categoryID });
  };

  useError([...getCategoriesSumErrors(), ...getTransactionErrors()]);

  return (
    <BaseLoadableView
      isLoading={isCategoriesSumLoading || isTransactionLoading}>
      <Title>Metrics</Title>
      <Metrics items={parseMetrics()} />

      <Title
        onPress={() => {
          navigation.navigate();
        }}>
        Expenses
      </Title>
      <BaseHoriScrollableItems
        onAdd={onAddCategory}
        onPress={onCategoryPress}
        items={getSortedExpenseCategoriesSum()}
        renderItem={renderSpendingItem}
      />

      <Title
        onPress={() => {
          navigation.navigate();
        }}>
        Incomes
      </Title>
      <BaseHoriScrollableItems
        onAdd={onAddCategory}
        onPress={onCategoryPress}
        items={getSortedIncomeCategoriesSum()}
        renderItem={renderSpendingItem}
      />
    </BaseLoadableView>
  );
};

const SpendingItem = ({ category = {} }) => {
  const { theme } = useTheme();
  const styles = getStyles();
  const { category_name: categoryName = '', sum = new Amount() } = category;

  return (
    <View style={styles.spendingItem}>
      <BaseText text3 numberOfLines={1} color={theme.colors.color6}>
        {categoryName}
      </BaseText>
      <AmountText
        text4
        sensitive
        margin={{ top: 8 }}
        color={theme.colors.color7}
        amount={sum}
      />
    </View>
  );
};

const getStyles = theme =>
  StyleSheet.create({
    spendingItem: {
      minHeight: 50,
      justifyContent: 'center',
    },
  });

export { SpendingInsight, SpendingGraph };
