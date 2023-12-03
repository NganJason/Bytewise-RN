import { useNavigation } from '@react-navigation/native';
import {
  AmountText,
  BaseScreenV2,
  BaseText,
  PieChartWithBreakdown,
} from '../../../Components';
import {
  TRANSACTION_TYPES,
  TRANSACTION_TYPE_EXPENSE,
} from '../../../_shared/apis/enum';
import { useCategoriesSum, useError } from '../../../_shared/hooks';
import { Amount } from '../../../_shared/object';
import {
  capitalize,
  getMonth,
  getUnixRangeOfMonth,
  getYear,
} from '../../../_shared/util';
import ROUTES from '../../../_shared/constant/routes';
import { useState } from 'react';

const CategoriesOverviewScreen = ({ route }) => {
  const navigation = useNavigation();
  const { type = TRANSACTION_TYPE_EXPENSE } = route?.params || {};
  const [selectedCategory, setSelectedCategory] = useState(null);
  const {
    getSortedExpenseCategoriesSum,
    getSortedIncomeCategoriesSum,
    getTotalExpenses,
    getTotalIncomes,
    getErrors: getCategoriesSumErrors,
    isLoading: isCategoriesSumLoading,
  } = useCategoriesSum(getUnixRangeOfMonth(getYear(), getMonth()));

  const parseData = () => {
    let categories;
    if (type === TRANSACTION_TYPE_EXPENSE) {
      categories = getSortedExpenseCategoriesSum();
    } else {
      categories = getSortedIncomeCategoriesSum();
    }
    return categories.map(d => {
      d.name = d.category_name;
      d.value = Math.abs(Number(d?.sum?.amount || 0));
      d.currency = d?.sum?.currency || '';
      d.onRowPress = () => onCategoryPress(d);
      return d;
    });
  };

  const getTotal = () => {
    if (selectedCategory !== null) {
      const { amount = 0, currency = '' } = selectedCategory?.sum || {};
      return new Amount(Math.abs(amount), currency);
    } else if (type === TRANSACTION_TYPE_EXPENSE) {
      return getTotalExpenses();
    } else {
      return getTotalIncomes();
    }
  };

  const onCategoryPress = category => {
    navigation.navigate(ROUTES.categoryBreakdown, {
      category_id: category?.category_id || '',
    });
  };

  useError(getCategoriesSumErrors());

  return (
    <BaseScreenV2
      isLoading={isCategoriesSumLoading}
      hideInfoButtonProps={{ show: true }}
      drawerButtonProps={{ show: true }}
      backButtonProps={{ show: true }}
      headerProps={{
        allowBack: true,
        centerComponent: (
          <BaseText h2>{capitalize(TRANSACTION_TYPES[type])}</BaseText>
        ),
      }}>
      <PieChartWithBreakdown
        rowSensitive
        data={parseData()}
        onSelectedItemChange={d => setSelectedCategory(d)}
        centerComponent={
          <>
            <AmountText h1 sensitive amount={getTotal()} adjustsFontSizeToFit />
            <BaseText>
              {selectedCategory ? selectedCategory.category_name : 'Total'}
            </BaseText>
          </>
        }
      />
    </BaseScreenV2>
  );
};

export default CategoriesOverviewScreen;
