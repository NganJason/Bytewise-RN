import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '@rneui/themed';

import {
  BaseScreen,
  DateNavigator,
  BaseScrollView,
  BaseText,
  AmountText,
  BaseButton,
  BaseTabView,
} from '../../Components';

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
import { renderErrorsToast } from '../../_shared/util/toast';
import { useAggrTransactions } from '../../_shared/query';
import { capitalizeWords } from '../../_shared/util/string';
import { BaseRow } from '../../Components/View';
import { EmptyContent } from '../../Components/Common';
import { EmptyContentConfig } from '../../_shared/constant/constant';

const TODAY = new Date();

const CategoryScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  const [activeDate, setActiveDate] = useState(TODAY);
  const [timeRange, setTimeRange] = useState(
    getUnixRangeOfMonth(getYear(activeDate), getMonth(activeDate)),
  );

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
        <EmptyContent
          item={EmptyContentConfig.category}
          route={ROUTES.categoryForm}
        />
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

  const onDateMove = newDate => {
    setActiveDate(newDate);
    setTimeRange(getUnixRangeOfMonth(getYear(newDate), getMonth(newDate)));
  };

  const isScreenLoading = () => {
    return (
      getCategoriesQuery.isLoading ||
      aggrTransactionsByTypeQuery.isLoading ||
      aggrTransactionsByCategoryQuery.isLoading
    );
  };

  return (
    <BaseScreen
      isLoading={isScreenLoading()}
      errorToast={renderErrorsToast([
        getCategoriesQuery,
        aggrTransactionsByTypeQuery,
        aggrTransactionsByCategoryQuery,
      ])}
      headerProps={{
        allowBack: false,
        allowDrawer: true,
        centerComponent: (
          <DateNavigator
            startingDate={activeDate}
            onForward={onDateMove}
            onBackward={onDateMove}
          />
        ),
      }}
      fabProps={{
        show: true,
        placement: 'right',
        iconName: 'plus',
        iconType: 'entypo',
        iconColor: theme.colors.white,
        color: theme.colors.color1,
        onPress: () => navigation.navigate(ROUTES.categoryForm),
      }}>
      <>
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
        <BaseScrollView showsVerticalScrollIndicator={false}>
          {renderRows()}
        </BaseScrollView>
      </>
    </BaseScreen>
  );
};

export default CategoryScreen;

const getStyles = _ =>
  StyleSheet.create({
    tabContainer: {
      marginBottom: 14,
    },
  });
