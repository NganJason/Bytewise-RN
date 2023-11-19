import { useNavigation } from '@react-navigation/native';
import { useTheme } from '@rneui/themed';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import {
  AmountText,
  BaseHoriScrollableItems,
  BaseLoadableView,
  BaseText,
} from '../../Components';
import ROUTES from '../../_shared/constant/routes';
import {
  useCategoriesSum,
  useError,
  useTransactionGroups,
} from '../../_shared/hooks';
import { Amount } from '../../_shared/object';
import { Metrics, Title } from './common';

const metricItems = [
  {
    name: 'Debt Ratio',
    val: '10%',
  },
  {
    name: 'Investment Ratio',
    val: '10%',
  },
  {
    name: 'Emergency Fund Ratio',
    val: '10%',
  },
];

const SpendingInsight = () => {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const navigation = useNavigation();

  const [activeDate] = useState(new Date());
  const {
    timeRange,
    getMonthlyTotalIncome,
    getMonthlyTotalExpense,
    getMonthlyTotalSavings,
    getErrors: getTransactionErrors,
    isLoading: isTransactionLoading,
  } = useTransactionGroups(activeDate);

  const {
    getSortedExpenseCategoriesSum,
    getSortedIncomeCategoriesSum,
    getErrors: getCategoriesSumErrors,
    isLoading: isCategoriesSumLoading,
  } = useCategoriesSum(timeRange);

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
      <Metrics items={metricItems} />

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

export default SpendingInsight;
