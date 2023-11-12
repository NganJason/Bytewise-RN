import { useNavigation } from '@react-navigation/native';

import { BaseText, BaseScrollableTab, BaseScreenV2 } from '../../Components';

import ROUTES from '../../_shared/constant/routes';
import {
  TRANSACTION_TYPE_EXPENSE,
  TRANSACTION_TYPE_INCOME,
} from '../../_shared/apis/enum';
import { useGetCategories } from '../../_shared/query';
import EmptyContent from '../../Components/Common/EmptyContent';
import { BaseRow } from '../../Components/View';
import { useState } from 'react';
import { useError } from '../../_shared/hooks';

const CATEGORY_TYPES = [
  {
    name: 'Expense',
    val: TRANSACTION_TYPE_EXPENSE,
    iconName: 'shopping-bag',
    iconType: 'feather',
  },
  {
    name: 'Income',
    val: TRANSACTION_TYPE_INCOME,
    iconName: 'credit-card',
    iconType: 'feather',
  },
];

const CategoryEditScreen = ({ route }) => {
  const navigation = useNavigation();

  const { category_type = TRANSACTION_TYPE_EXPENSE } = route?.params || {};

  const [activeTabIdx, setActiveTabIdx] = useState(category_type - 1);

  const [categoryType, setCategoryType] = useState(category_type);

  const onCategoryTypeChange = idx => {
    setActiveTabIdx(idx);
    setCategoryType(CATEGORY_TYPES[idx].val);
  };

  const getCategoriesQuery = useGetCategories({
    category_type: categoryType,
  });

  const renderRowsV2 = () => {
    if (
      getCategoriesQuery.data?.categories?.length === 0 &&
      !getCategoriesQuery.isLoading
    ) {
      return <EmptyContent />;
    }

    const rows = [];
    getCategoriesQuery.data?.categories?.map((category, i) => {
      rows.push(
        <BaseRow
          key={i}
          onPress={() => {
            navigation.navigate(ROUTES.categoryForm, {
              category_id: category.category_id,
            });
          }}>
          <BaseText text2 numberOfLines={1} ellipsizeMode="tail">
            {category.category_name}
          </BaseText>
        </BaseRow>,
      );
    });

    return rows;
  };

  useError([getCategoriesQuery]);

  return (
    <BaseScreenV2
      isLoading={getCategoriesQuery.isLoading}
      backButtonProps={{ show: true }}
      subHeader={
        <BaseScrollableTab
          tabs={CATEGORY_TYPES}
          activeTabIdx={activeTabIdx}
          onTabChange={onCategoryTypeChange}
        />
      }
      fabProps={{
        show: true,
        onPress: () =>
          navigation.navigate(ROUTES.categoryForm, {
            category_type: categoryType,
          }),
      }}
      headerProps={{
        centerComponent: <BaseText h2>Categories</BaseText>,
      }}>
      {renderRowsV2()}
    </BaseScreenV2>
  );
};

export default CategoryEditScreen;
