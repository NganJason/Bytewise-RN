import { StyleSheet, View } from 'react-native';
import { useTheme } from '@rneui/themed';
import { useNavigation } from '@react-navigation/native';

import {
  BaseScreen,
  BaseText,
  BaseScrollView,
  BaseButton,
} from '../../Components';

import ROUTES from '../../_shared/constant/routes';
import {
  TRANSACTION_TYPES,
  TRANSACTION_TYPE_EXPENSE,
  TRANSACTION_TYPE_INCOME,
} from '../../_shared/apis/enum';
import { useGetCategories } from '../../_shared/query';
import { renderErrorsToast } from '../../_shared/util/toast';
import EmptyContent from '../../Components/Common/EmptyContent';
import { EmptyContentConfig } from '../../_shared/constant/constant';
import { BaseRow, BaseTabView } from '../../Components/View';
import { useState } from 'react';

const CategoryEditScreen = ({ route }) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const navigation = useNavigation();

  const { category_type = TRANSACTION_TYPE_EXPENSE } = route.params || {};

  const getCategoriesQuery = useGetCategories({});

  const [categoryType, setCategoryType] = useState(category_type);
  const onCategoryTypeChange = type => {
    setCategoryType(type);
  };

  const renderRows = () => {
    let rows = [];

    getCategoriesQuery.data?.categories?.map((category, i) => {
      if (category.category_type === categoryType) {
        rows.push(
          <BaseRow
            key={i}
            onPress={() => {
              navigation.navigate(ROUTES.categoryForm, {
                category_id: category.category_id,
              });
            }}>
            <BaseText text2>{category.category_name}</BaseText>
          </BaseRow>,
        );
      }
    });

    if (rows.length === 0 && !getCategoriesQuery.isLoading) {
      return (
        <View style={styles.emptyContent}>
          <EmptyContent
            item={EmptyContentConfig.category}
            route={ROUTES.categoryForm}
          />
        </View>
      );
    }

    return rows;
  };

  return (
    <BaseScreen
      isLoading={getCategoriesQuery.isLoading}
      errorToast={renderErrorsToast([getCategoriesQuery])}
      headerProps={{
        allowBack: true,
        centerComponent: <BaseText h2>Categories</BaseText>,
      }}>
      <BaseTabView
        onPress={idx => onCategoryTypeChange(idx + 1)}
        selectedIndex={categoryType - 1}
        titles={[
          TRANSACTION_TYPES[TRANSACTION_TYPE_EXPENSE],
          TRANSACTION_TYPES[TRANSACTION_TYPE_INCOME],
        ]}
      />
      <View style={styles.buttonContainer}>
        <BaseButton
          title="Add category"
          type="secondary"
          align="flex-end"
          size="sm"
          onPress={() => navigation.navigate(ROUTES.categoryForm)}
        />
      </View>
      <BaseScrollView showsVerticalScrollIndicator={false}>
        {renderRows()}
      </BaseScrollView>
    </BaseScreen>
  );
};

const getStyles = _ => {
  return StyleSheet.create({
    emptyContent: {
      marginTop: '30%',
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%',
    },
    buttonContainer: {
      marginVertical: 14,
    },
  });
};

export default CategoryEditScreen;
