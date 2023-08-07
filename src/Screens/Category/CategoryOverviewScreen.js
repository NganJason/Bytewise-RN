import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '@rneui/themed';
import { useNavigation } from '@react-navigation/native';
import {
  BaseDonutChart,
  BaseLoadableView,
  BaseRow,
  ChartLegend,
  DateNavigator,
  EmptyContent,
  BaseText,
  AmountText,
  BaseScreen,
  BaseDivider,
  BaseBottomSelectTab,
} from '../../Components';
import { useGetCategories } from '../../_shared/query';
import { useAggrTransactions } from '../../_shared/query';
import { useError } from '../../_shared/hooks/error';
import { capitalize } from '../../_shared/util/string';
import {
  DonutChartColors,
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
import { useTimeRange } from '../../_shared/hooks';

const CategoryOverviewScreen = ({ route }) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const navigation = useNavigation();

  const {
    active_date: activeTs = new Date().valueOf(),
    category_type: categoryType = TRANSACTION_TYPE_EXPENSE,
  } = route?.params || {};

  const [timeRangeType, setTimeRangeType] = useState(TIME_RANGE_MONTHLY);
  const onTimeRangeTypeChange = e => {
    setTimeRangeType(e.value);
  };

  const { activeDate, timeRange, onDateMove } = useTimeRange(
    activeTs,
    timeRangeType,
  );

  const { categoriesInfo, isScreenLoading } = useCategoryInfo(
    timeRange,
    categoryType,
  );

  const renderRows = () => {
    let rows = [];
    categoriesInfo.forEach(category => {
      rows.push(
        <BaseRow
          key={category.category_id}
          onPress={() => {
            navigation.navigate(ROUTES.categoryBreakdown, {
              category_id: category.category_id,
              active_ts: activeDate.valueOf(),
              category_type: categoryType,
            });
          }}>
          <ChartLegend
            color={category.color}
            text={capitalize(category.category_name)}
            text3
          />
          <AmountText text3>{category.sum}</AmountText>
        </BaseRow>,
      );
    });

    if (rows.length === 0) {
      return (
        <EmptyContent
          item={EmptyContentConfig.categoryOverview}
          route={ROUTES.categoryForm}
          routeParam={{ category_type: categoryType }}
        />
      );
    }

    return rows;
  };

  const getCategoriesTotal = () => {
    let sum = 0;
    categoriesInfo.map(category => {
      sum += category.sum;
    });
    return sum;
  };

  return (
    <BaseScreen
      headerProps={{
        allowBack: true,
        centerComponent: (
          <View style={styles.header}>
            <BaseText h3>Breakdown</BaseText>
            <DateNavigator
              startingDate={activeDate}
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
      <BaseDonutChart
        items={categoriesInfo}
        innerLabel={{
          title: `$ ${getCategoriesTotal()}`,
          subtitle: TRANSACTION_TYPES[categoryType],
        }}
      />
      {categoriesInfo.length === 0 && <BaseDivider margin={10} />}

      <BaseLoadableView scrollable={true} isLoading={isScreenLoading()}>
        <View style={styles.body}>{renderRows()}</View>
      </BaseLoadableView>
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
    categories.map((category, idx) => {
      category.color = DonutChartColors[idx];
    });

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
