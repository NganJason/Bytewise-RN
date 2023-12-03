import { useNavigation } from '@react-navigation/native';
import { useTheme } from '@rneui/themed';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import {
  AmountText,
  BaseHoriScrollableItems,
  BaseLoadableView,
  BaseText,
  LineChartWithGranularity,
} from '../../Components';
import {
  METRIC_TYPE_SAVINGS,
  TRANSACTION_TYPE_EXPENSE,
  TRANSACTION_TYPE_INCOME,
} from '../../_shared/apis/enum';
import ROUTES from '../../_shared/constant/routes';
import {
  useCategoriesSum,
  useError,
  useSpendingGraph,
  useTransactionGroups,
} from '../../_shared/hooks';
import { Amount } from '../../_shared/object';
import { useGetMetrics } from '../../_shared/query';
import {
  getMonth,
  getUnixRangeOfMonth,
  getYear,
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
  } = useSpendingGraph(granularities, 1);
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

const SpendingInsight = () => {
  const navigation = useNavigation();
  const {
    getSortedExpenseCategoriesSum,
    getSortedIncomeCategoriesSum,
    getErrors: getCategoriesSumErrors,
    isLoading: isCategoriesSumLoading,
  } = useCategoriesSum(getUnixRangeOfMonth(getYear(), getMonth()));

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

  const isLoading = isCategoriesSumLoading;
  useError([...getCategoriesSumErrors()]);

  return (
    <BaseLoadableView isLoading={isLoading}>
      <Title>Metrics</Title>
      <Metrics items={parseMetrics()} />

      <Title
        onPress={() => {
          navigation.navigate(ROUTES.categoryOverview, {
            type: TRANSACTION_TYPE_EXPENSE,
          });
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
          navigation.navigate(ROUTES.categoryOverview, {
            type: TRANSACTION_TYPE_INCOME,
          });
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

const getStyles = _ =>
  StyleSheet.create({
    spendingItem: {
      minHeight: 50,
      justifyContent: 'center',
    },
    percentChange: {
      flexDirection: 'row',
      marginVertical: 5,
    },
  });

export { SpendingInsight, SpendingGraph };
