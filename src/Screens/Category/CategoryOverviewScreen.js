import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '@rneui/themed';

import { BaseText, AmountText, BaseScreen } from '../../Components';

import {
  TRANSACTION_TYPES,
  TRANSACTION_TYPE_EXPENSE,
} from '../../_shared/apis/enum';
import {
  getUnixRangeOfMonth,
  getYear,
  getMonth,
} from '../../_shared/util/date';
import ROUTES from '../../_shared/constant/routes';
import { useGetCategories } from '../../_shared/query';
import { useAggrTransactions } from '../../_shared/query';
import { capitalize } from '../../_shared/util/string';
import { BaseLoadableView, BaseRow } from '../../Components/View';
import { DateNavigator, EmptyContent } from '../../Components/Common';
import { EmptyContentConfig } from '../../_shared/constant/constant';
import { useNavigation } from '@react-navigation/native';
import { useError } from '../../_shared/hooks/error';

const CategoryOverviewScreen = ({ route }) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const navigation = useNavigation();

  const {
    active_date: activeD = new Date(),
    category_type: categoryType = TRANSACTION_TYPE_EXPENSE,
  } = route?.params || {};

  const [activeDate, setActiveDate] = useState(activeD);
  const [timeRange, setTimeRange] = useState(
    getUnixRangeOfMonth(getYear(activeDate), getMonth(activeDate)),
  );
  const onDateMove = newDate => {
    setActiveDate(newDate);
    setTimeRange(getUnixRangeOfMonth(getYear(newDate), getMonth(newDate)));
  };

  const getCategoriesQuery = useGetCategories({});

  const aggrTransactionsByTypeQuery = useAggrTransactions({
    transaction_types: [categoryType],
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
                category_type: categoryType,
              });
            }}>
            <BaseText text3>{capitalize(category.category_name)}</BaseText>
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
          routeParam={{ category_type: categoryType }}
          marginVertical="30%"
        />
      );
    }

    return rows;
  };

  const isScreenLoading = () => {
    return (
      getCategoriesQuery.isLoading ||
      aggrTransactionsByTypeQuery.isLoading ||
      aggrTransactionsByCategoryQuery.isLoading
    );
  };

  useError([
    getCategoriesQuery,
    aggrTransactionsByTypeQuery,
    aggrTransactionsByCategoryQuery,
  ]);

  return (
    <BaseScreen
      headerProps={{
        allowBack: true,
        centerComponent: (
          <View style={styles.header}>
            <BaseText h3>{TRANSACTION_TYPES[categoryType]}</BaseText>
            <DateNavigator
              startingDate={activeDate}
              onForward={onDateMove}
              onBackward={onDateMove}
            />
            <View style={styles.headerSubtitle}>
              <BaseText text3 margin={{ right: 8 }}>
                Total:
              </BaseText>
              <AmountText>
                {aggrTransactionsByTypeQuery?.data?.results?.[categoryType]
                  ?.sum || 0}
              </AmountText>
            </View>
          </View>
        ),
      }}>
      <BaseLoadableView scrollable={true} isLoading={isScreenLoading()}>
        {renderRows()}
      </BaseLoadableView>
    </BaseScreen>
  );
};

export default CategoryOverviewScreen;

const getStyles = _ =>
  StyleSheet.create({
    header: {
      alignItems: 'center',
    },
    headerSubtitle: { flexDirection: 'row' },
    tabContainer: {
      marginBottom: 14,
    },
    buttonContainer: {
      marginTop: 6,
    },
  });
