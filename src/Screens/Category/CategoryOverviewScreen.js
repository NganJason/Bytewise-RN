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
import { useSumCategoryTransactions } from '../../_shared/query/category';

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

  const { categoriesInfo, totalSum, isLoading } = useCategoryInfo(
    timeRange,
    categoryType,
  );

  const chartItems = () => {
    let items = [];
    categoriesInfo.forEach(d => {
      items.push({
        name: d.category_name,
        value: Math.abs(d.sum),
        onPress: () => {
          navigation.navigate(ROUTES.categoryBreakdown, {
            category_id: d.category_id ? d.category_id : '',
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
          title: `S$ ${totalSum}`,
          subtitle: TRANSACTION_TYPES[categoryType],
        }}
        isLoading={isLoading}
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
  const [totalSum, setTotalSum] = useState(0);

  const sumCategoryTransactions = useSumCategoryTransactions({
    transaction_time: {
      gte: timeRange[0],
      lte: timeRange[1],
    },
    transaction_type: categoryType,
  });

  useEffect(() => {
    const { sums = [] } = sumCategoryTransactions?.data || {};

    let total = 0;
    sums.map(d => {
      total += Math.abs(d.sum);
    });

    let info = [];
    let uncategorisedCategory = null;
    sums.map(d => {
      if (d.category) {
        info.push({
          category_id: d.category.category_id,
          category_name: d.category.category_name,
          sum: Math.abs(d.sum).toFixed(2),
        });
      } else {
        uncategorisedCategory = {
          category_name: 'Uncategorised',
          sum: Math.abs(d.sum).toFixed(2),
        };
      }
    });
    info.sort((a, b) => a.category_name.localeCompare(b.category_name));

    if (uncategorisedCategory) {
      info.push(uncategorisedCategory);
    }

    setTotalSum(total.toFixed(2));
    setCategoriesInfo(info);
  }, [sumCategoryTransactions.data]);

  useError([sumCategoryTransactions]);

  return {
    categoriesInfo,
    totalSum,
    isLoading: sumCategoryTransactions.isLoading,
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
