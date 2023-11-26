import { useNavigation } from '@react-navigation/native';
import { useTheme } from '@rneui/themed';
import { useState } from 'react';
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
import { Metrics, Title } from './common';

const SpendingGraph = () => {
  const [value, setValue] = useState(0);
  const getTransactionsSumamry = useGetTransactionsSummary({
    unit: 1,
    interval: 3,
  });

  const parseSummaryData = () => {
    const data = getTransactionsSumamry?.data?.summary || [];
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

      <Title>Expenses</Title>
      <BaseHoriScrollableItems
        onAdd={onAddCategory}
        onPress={onCategoryPress}
        items={getSortedExpenseCategoriesSum()}
        renderItem={renderSpendingItem}
      />

      <Title>Incomes</Title>
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
