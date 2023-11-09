import { useState, useContext } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTheme } from '@rneui/themed';
import { useNavigation } from '@react-navigation/native';
import CircularProgress from 'react-native-circular-progress-indicator';

import {
  BaseScreenV2,
  DateNavigator,
  BaseScrollableTab,
  EmptyContent,
  BaseText,
  AmountText,
} from '../../Components';
import { useTimeRange } from '../../_shared/hooks';
import { useGetCategoriesHelper, useError } from '../../_shared/hooks';
import {
  TIME_RANGE_MONTHLY,
  TIME_RANGE_YEARLY,
} from '../../_shared/constant/constant';
import BudgetRowV2 from './BudgetRowV2';
import {
  BUDGET_TYPE_ANNUAL,
  BUDGET_TYPE_MONTHLY,
} from '../../_shared/apis/enum';
import ROUTES from '../../_shared/constant/routes';
import { Amount } from '../../_shared/object';
import { UserMetaContext } from '../../_shared/context/UserMetaContext';
import { getProgress } from '../../_shared/util';

const TODAY = new Date();
const BUDGET_TYPES = [
  {
    name: 'Monthly',
    iconName: 'filetext1',
    iconType: 'ant-design',
    budgetType: BUDGET_TYPE_MONTHLY,
    timeRange: TIME_RANGE_MONTHLY,
  },
  {
    name: 'Annual',
    iconName: 'grid',
    iconType: 'feather',
    budgetType: BUDGET_TYPE_ANNUAL,
    timeRange: TIME_RANGE_YEARLY,
  },
];

const BudgetScreen = () => {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const navigation = useNavigation();
  const { getUserBaseCurrency } = useContext(UserMetaContext);

  const [activeTabIdx, setActiveTabIdx] = useState(0);

  const { activeDate, onDateMove, timeRangeType, setTimeRangeType } =
    useTimeRange(TODAY.valueOf(), BUDGET_TYPES[activeTabIdx]);

  const { categoriesWithBudget, isLoading, getQueries } =
    useGetCategoriesHelper({
      budgetDate: activeDate,
    });

  const renderBody = (type = BUDGET_TYPE_MONTHLY) => {
    const rows = [];

    categoriesWithBudget.map(category => {
      const { budget = {}, category_id: categoryID = '' } = category || {};
      const { budget_type: budgetType = BUDGET_TYPE_MONTHLY } = budget || {};

      if (budgetType !== type) {
        return;
      }
      rows.push(
        <View style={styles.budgetRow} key={categoryID}>
          <BudgetRowV2 categoryWithBudget={category} activeDate={activeDate} />
        </View>,
      );
    });

    if (rows.length === 0 && !isLoading()) {
      return (
        <View style={styles.emptyContainer}>
          <EmptyContent />
        </View>
      );
    }

    return rows;
  };

  const getBudgetSum = () => {
    let sum = 0;
    let budgetCurrency = getUserBaseCurrency();

    categoriesWithBudget.map(category => {
      const {
        budget_type: budgetType = BUDGET_TYPE_MONTHLY,
        amount = 0,
        currency = getUserBaseCurrency(),
      } = category?.budget || {};

      if (budgetType === BUDGET_TYPES[activeTabIdx].budgetType) {
        sum += Number(amount);
      }
      budgetCurrency = currency;
    });
    return new Amount(sum, budgetCurrency);
  };

  const getTotalUsedAmount = () => {
    let sum = 0;
    let budgetCurrency = getUserBaseCurrency();

    categoriesWithBudget.map(category => {
      const {
        budget_type: budgetType = BUDGET_TYPE_MONTHLY,
        used_amount: usedAmount = 0,
        currency = getUserBaseCurrency(),
      } = category?.budget || {};

      if (budgetType === BUDGET_TYPES[activeTabIdx].budgetType) {
        sum += Number(usedAmount);
      }
      budgetCurrency = currency;
    });
    return new Amount(sum, budgetCurrency);
  };

  const getUsagePercentage = () => {
    const percentage =
      getProgress(
        getTotalUsedAmount().getAmount(),
        getBudgetSum().getAmount(),
      ) * 100;
    return percentage.toFixed(0);
  };

  const onBudgetTypeChange = idx => {
    setTimeRangeType(BUDGET_TYPES[idx].timeRange);
    setActiveTabIdx(idx);
  };

  const onFabPress = () => {
    navigation.navigate(ROUTES.budgetForm, {
      active_date: activeDate.valueOf(),
      budget_type: BUDGET_TYPES[activeTabIdx].budgetType,
    });
  };

  const getCircularProgressMaxValue = () =>
    getUsagePercentage() >= 100 ? getUsagePercentage() : 100;

  useError(getQueries());

  return (
    <BaseScreenV2
      isLoading={isLoading()}
      drawerButtonProps={{ show: true }}
      subHeader={
        <>
          <BaseScrollableTab
            tabs={BUDGET_TYPES}
            activeTabIdx={activeTabIdx}
            onTabChange={onBudgetTypeChange}
          />
          {getBudgetSum().getAmount() > 0 && (
            <View style={styles.circularProgressContainer}>
              <CircularProgress
                value={getUsagePercentage()}
                radius={80}
                duration={1000}
                maxValue={getCircularProgressMaxValue()}
                valueSuffix={'%'}
                progressValueFontSize={34}
                title={
                  <>
                    <BaseText text4>of </BaseText>
                    <AmountText
                      text4
                      amount={
                        new Amount(
                          getBudgetSum().getAmount(),
                          getBudgetSum().getCurrency(),
                        )
                      }
                      style={{ color: theme.colors.color7 }}
                      sensitive
                    />
                  </>
                }
                progressValueColor={theme.colors.color7}
                strokeColorConfig={[
                  { color: theme.colors.success, value: 0 },
                  { color: theme.colors.warning, value: 80 },
                  { color: theme.colors.error, value: 100 },
                ]}
              />
            </View>
          )}
        </>
      }
      headerProps={{
        centerComponent: (
          <DateNavigator
            date={activeDate}
            onForward={onDateMove}
            onBackward={onDateMove}
            isYear={timeRangeType === TIME_RANGE_YEARLY}
            enablePicker
          />
        ),
      }}
      fabProps={{ show: true, onPress: onFabPress }}>
      {renderBody(BUDGET_TYPES[activeTabIdx].budgetType)}
    </BaseScreenV2>
  );
};

const getStyles = _ =>
  StyleSheet.create({
    scrollableTab: {
      marginTop: 16,
    },
    emptyContainer: {
      height: '100%',
    },
    budgetRow: {
      marginBottom: 32,
    },
    circularProgressContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginTop: 18,
    },
  });

export default BudgetScreen;
