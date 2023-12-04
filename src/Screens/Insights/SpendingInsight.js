import { useNavigation } from '@react-navigation/native';
import { useTheme } from '@rneui/themed';
import { StyleSheet, View } from 'react-native';
import {
  AmountText,
  BaseHoriScrollableItems,
  BaseLoadableView,
  BaseText,
} from '../../Components';
import {
  METRIC_TYPE_SAVINGS,
  TRANSACTION_TYPE_EXPENSE,
  TRANSACTION_TYPE_INCOME,
} from '../../_shared/apis/enum';
import ROUTES from '../../_shared/constant/routes';
import { useCategoriesSum, useError } from '../../_shared/hooks';
import { Amount } from '../../_shared/object';
import { useGetMetrics } from '../../_shared/query';
import { getMonth, getUnixRangeOfMonth, getYear } from '../../_shared/util';
import { Metrics, Title } from './common';

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
  });

export { SpendingInsight };
