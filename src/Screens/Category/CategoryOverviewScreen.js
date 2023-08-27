import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '@rneui/themed';
import { useNavigation } from '@react-navigation/native';
import {
  DateNavigator,
  EmptyContent,
  BaseText,
  BaseScreen,
  BaseBottomSelectTab,
  BaseDonutChartWithRows,
} from '../../Components';
import { useGetCategories } from '../../_shared/query';
import { useAggrTransactions } from '../../_shared/query';
import {
  EmptyContentConfig,
  TIME_RANGE_MONTHLY,
  TIME_RANGE_TYPES,
  TIME_RANGE_YEARLY,
} from '../../_shared/constant/constant';
import {
  TRANSACTION_TYPES,
  TRANSACTION_TYPE_EXPENSE,
} from '../../_shared/apis/enum';
import ROUTES from '../../_shared/constant/routes';
import { useTimeRange, useError } from '../../_shared/hooks';

const CategoryOverviewScreen = ({ route }) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const navigation = useNavigation();

  const {
    active_date: activeTs = new Date().valueOf(),
    defaultTimeRangeType = TIME_RANGE_MONTHLY,
    category_type: categoryType = TRANSACTION_TYPE_EXPENSE,
  } = route?.params || {};

  const { activeDate, timeRange, onDateMove, timeRangeType, setTimeRangeType } =
    useTimeRange(activeTs, defaultTimeRangeType);
  const onTimeRangeTypeChange = e => {
    setTimeRangeType(e.value);
  };

  const { categoriesInfo, isScreenLoading } = useCategoryInfo(
    timeRange,
    categoryType,
  );

  const getCategoriesTotal = () => {
    let sum = 0;
    categoriesInfo.map(category => {
      sum += category.sum;
    });
    return sum.toFixed(2);
  };

  const chartItems = () => {
    let items = [];

    categoriesInfo.forEach(d => {
      items.push({
        name: d.category_name,
        value: d.sum,
        onPress: () => {
          navigation.navigate(ROUTES.categoryBreakdown, {
            category_id: d.category_id,
            active_ts: activeDate.valueOf(),
            category_type: categoryType,
          });
        },
      });
    });
    return items;
  };

  return (
    <BaseScreen
      headerProps={{
        allowBack: true,
        centerComponent: (
          <View style={styles.header}>
            <BaseText h3>Breakdown</BaseText>
            <DateNavigator
              date={activeDate}
              onForward={onDateMove}
              onBackward={onDateMove}
              year={timeRangeType === TIME_RANGE_YEARLY}
            />
          </View>
        ),
        rightComponent: (
          <BaseBottomSelectTab
            currTabText={TIME_RANGE_TYPES[timeRangeType][0]}
            items={[
              { name: 'Monthly', value: TIME_RANGE_MONTHLY },
              { name: 'Yearly', value: TIME_RANGE_YEARLY },
            ]}
            onSelect={onTimeRangeTypeChange}
          />
        ),
      }}>
      <BaseDonutChartWithRows
        items={chartItems()}
        donutInnerLabel={{
          title: `S$ ${getCategoriesTotal()}`,
          subtitle: TRANSACTION_TYPES[categoryType],
        }}
        isLoading={isScreenLoading()}
        emptyContent={
          <EmptyContent
            item={EmptyContentConfig.categoryOverview}
            route={ROUTES.categoryForm}
            routeParam={{ category_type: categoryType }}
          />
        }
      />
    </BaseScreen>
  );
};

const useCategoryInfo = (timeRange, categoryType) => {
  const [categoriesInfo, setCategoriesInfo] = useState([]);
  const getCategoriesQuery = useGetCategories({});

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

  useEffect(() => {
    let { categories = [] } = getCategoriesQuery.data || {};
    categories = categories.filter(
      category => category.category_type === categoryType,
    );

    categories.map(category => {
      const sum =
        aggrTransactionsByCategoryQuery.data?.results?.[category.category_id]
          ?.sum || 0;

      category.sum = Math.abs(sum);
      category.value = Math.abs(sum); // for chart
    });

    categories.sort((a, b) => a.category_name - b.category_name);
    setCategoriesInfo(categories);
  }, [getCategoriesQuery.data, aggrTransactionsByCategoryQuery.data]);

  const isScreenLoading = () => {
    return (
      getCategoriesQuery.isLoading || aggrTransactionsByCategoryQuery.isLoading
    );
  };

  useError([getCategoriesQuery, aggrTransactionsByCategoryQuery]);

  return {
    categoriesInfo,
    isScreenLoading,
  };
};

export default CategoryOverviewScreen;

const getStyles = _ =>
  StyleSheet.create({
    header: {
      alignItems: 'center',
    },
    body: {
      marginTop: 10,
    },
  });
