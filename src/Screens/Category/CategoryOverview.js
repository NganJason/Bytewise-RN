import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '@rneui/themed';

import { BaseText, AmountText, BaseTabView } from '../../Components';

import {
  TRANSACTION_TYPE_EXPENSE,
  TRANSACTION_TYPE_INCOME,
  TRANSACTION_TYPES,
} from '../../_shared/apis/enum';
import {
  getUnixRangeOfMonth,
  getYear,
  getMonth,
} from '../../_shared/util/date';
import ROUTES from '../../_shared/constant/routes';
import { useGetCategories } from '../../_shared/query';
import { useAggrTransactions } from '../../_shared/query';
import { capitalizeWords } from '../../_shared/util/string';
import { BaseLoadableView, BaseRow } from '../../Components/View';
import { EmptyContent } from '../../Components/Common';
import { EmptyContentConfig } from '../../_shared/constant/constant';
import { useNavigation } from '@react-navigation/native';

const CategoryOverview = ({ activeDate = new Date() }) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const navigation = useNavigation();

  const [timeRange, setTimeRange] = useState(
    getUnixRangeOfMonth(getYear(activeDate), getMonth(activeDate)),
  );
  useEffect(() => {
    setTimeRange(
      getUnixRangeOfMonth(getYear(activeDate), getMonth(activeDate)),
    );
  }, [activeDate]);

  const [categoryType, setCategoryType] = useState(TRANSACTION_TYPE_EXPENSE);
  const onCategoryTypeChange = type => {
    setCategoryType(type);
  };
  const getCategoriesQuery = useGetCategories({});

  const renderRows = () => {
    let rows = [];
    let categories = getCategoriesQuery.data?.categories || [];

    categories.forEach(category => {
      if (category.category_type === categoryType) {
        const sum =
          aggrTransactionsByCategoryQuery.data?.results?.[category.category_id]
            ?.sum;

        rows.push(
          <BaseRow
            key={category.category_id}
            onPress={() => {
              navigation.navigate(ROUTES.categoryBreakdown, {
                category_id: category.category_id,
                active_timestamp: activeDate.valueOf(), // pass unix as date object is not serializable
              });
            }}>
            <BaseText text3>{capitalizeWords(category.category_name)}</BaseText>
            <AmountText text3>{sum}</AmountText>
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

  const aggrTransactionsByTypeQuery = useAggrTransactions({
    transaction_types: [TRANSACTION_TYPE_EXPENSE, TRANSACTION_TYPE_INCOME],
    transaction_time: {
      gte: timeRange[0],
      lte: timeRange[1],
    },
  });

  const aggrTransactionsByCategoryQuery = useAggrTransactions(
    {
      category_ids: getCategoriesQuery.data?.categories?.map(
        category => category.category_id,
      ),
      transaction_time: {
        gte: timeRange[0],
        lte: timeRange[1],
      },
    },
    {
      enabled:
        (!getCategoriesQuery.isLoading &&
          !getCategoriesQuery.isError &&
          getCategoriesQuery.data?.categories?.length !== 0) ||
        false,
    },
  );

  // TODO: Add back later
  const isScreenLoading = () => {
    return (
      getCategoriesQuery.isLoading ||
      aggrTransactionsByTypeQuery.isLoading ||
      aggrTransactionsByCategoryQuery.isLoading
    );
  };

  return (
    <View style={styles.screen}>
      <View style={styles.tabContainer}>
        <BaseTabView
          onPress={idx => onCategoryTypeChange(idx + 1)}
          selectedIndex={categoryType - 1}
          titles={[
            TRANSACTION_TYPES[TRANSACTION_TYPE_EXPENSE],
            TRANSACTION_TYPES[TRANSACTION_TYPE_INCOME],
          ]}
        />
      </View>
      <BaseLoadableView scrollable={true} isLoading={isScreenLoading()}>
        {renderRows()}
      </BaseLoadableView>
    </View>
  );
};

export default CategoryOverview;

const getStyles = _ =>
  StyleSheet.create({
    emptyContent: {
      marginTop: '30%',
    },
    screen: {
      height: '100%',
    },
    tabContainer: {
      marginBottom: 14,
    },
  });
