import { View, StyleSheet } from 'react-native';
import {
  BaseButton,
  BaseCalendar,
  BaseLoadableView,
  BaseScreen,
  BaseText,
  DailyTransactions,
  DateNavigator,
  EmptyContent,
} from '../../Components';
import { useTheme } from '@rneui/themed';
import { useEffect, useState } from 'react';
import {
  getDateObjFromDateStr,
  getFirstDayOfMonthFormatted,
  getFormattedDateString,
  getMonth,
  getUnixRangeOfMonth,
  getYear,
  groupTransactionGroupsByDateStr,
} from '../../_shared/util';
import { useDimension, useError } from '../../_shared/hooks';
import ROUTES from '../../_shared/constant/routes';
import { useNavigation } from '@react-navigation/native';
import { EmptyContentConfig } from '../../_shared/constant/constant';
import {
  useGetAccounts,
  useGetCategories,
  useGetTransactionGroups,
} from '../../_shared/query';
import { BaseFilter } from '../../Components/Common';
import { Amount } from '../../_shared/object';

const PAGING_LIMIT = 500;
const STARTING_PAGE = 1;

const TransactionCalendarScreen = () => {
  const { theme } = useTheme();
  const { screenHeight } = useDimension();
  const styles = getStyles(theme, screenHeight);
  const navigation = useNavigation();

  const [selectedDate, setSelectedDate] = useState(getFormattedDateString());
  const [currMonth, setCurrMonth] = useState(new Date());
  const [timeRange, setTimeRange] = useState(
    getUnixRangeOfMonth(getYear(currMonth), getMonth(currMonth)),
  );
  useEffect(() => {
    setTimeRange(getUnixRangeOfMonth(getYear(currMonth), getMonth(currMonth)));
  }, [currMonth]);

  const [selectedFilters, setSelectedFilters] = useState({
    Category: [],
    Account: [],
  });

  const getTransactionGroups = useGetTransactionGroups(
    {
      category_ids: selectedFilters?.Category.map(d => d.category_id) || [],
      account_id:
        selectedFilters?.Account?.length || [] > 0
          ? selectedFilters?.Account[0]?.account_id
          : null,
      transaction_time: {
        gte: timeRange[0],
        lte: timeRange[1],
      },
      paging: {
        limit: PAGING_LIMIT,
        page: STARTING_PAGE,
      },
    },
    {},
  );

  const getCategories = useGetCategories({});
  const { categories = [] } = getCategories?.data || {};

  const getAccounts = useGetAccounts({});
  let { accounts = [] } = getAccounts?.data || {};
  let dateStrToTransactionGroup = groupTransactionGroupsByDateStr(
    getTransactionGroups?.data?.transaction_groups || [],
  );
  const getSelectedDateTransactions = () => {
    return dateStrToTransactionGroup[selectedDate]?.transactions || [];
  };
  const getSelectedDateDailyTotal = () => {
    let { sum = 0, currency = null } = dateStrToTransactionGroup[selectedDate];
    return new Amount(sum, currency);
  };

  const onCurrMonthMove = e => {
    setCurrMonth(e);
    setSelectedDate(getFirstDayOfMonthFormatted(e));
  };

  const onDatePress = e => {
    setSelectedDate(e.dateString);
  };

  const onTodayPress = () => {
    setCurrMonth(new Date());
    setSelectedDate(getFormattedDateString());
  };

  const onFilterChange = e => {
    setSelectedFilters(e);
  };

  const getFilterOptions = () => {
    let categoryOptions = categories.map(d => {
      d.name = d.category_name;
      return d;
    });

    let accountOptions = accounts.map(d => {
      d.name = d.account_name;
      return d;
    });

    return [
      {
        name: 'Category',
        iconName: 'grid',
        iconType: 'feather',
        items: categoryOptions,
        emptyContentWithCallback: onPress => (
          <EmptyContent
            item={EmptyContentConfig.category}
            route={ROUTES.categoryForm}
            onRedirect={onPress}
          />
        ),
      },
      {
        name: 'Account',
        iconName: 'credit-card',
        iconType: 'feather',
        items: accountOptions,
        emptyContentWithCallback: onPress => (
          <EmptyContent
            item={EmptyContentConfig.account}
            route={ROUTES.accountSelection}
            onRedirect={onPress}
          />
        ),
      },
    ];
  };

  useError([getTransactionGroups]);

  const renderDayExtraInfo = date => {
    let totalIncome = Math.abs(
      dateStrToTransactionGroup[date.dateString]?.totalIncome || 0,
    );

    let totalExpense = Math.abs(
      dateStrToTransactionGroup[date.dateString]?.totalExpense || 0,
    );

    return (
      <View style={styles.dayInfoContainer}>
        {totalExpense > 0 && (
          <BaseText text6 margin={{ top: 0 }} color={theme.colors.regularRed}>
            {totalExpense.toFixed(2)}
          </BaseText>
        )}
        {totalIncome > 0 && (
          <BaseText text6 color={theme.colors.color1}>
            {totalIncome.toFixed(2)}
          </BaseText>
        )}
      </View>
    );
  };

  return (
    <BaseScreen
      allowLoadable={false}
      enablePadding={false}
      headerProps={{
        allowBack: true,
        centerComponent: (
          <DateNavigator
            date={currMonth}
            onForward={onCurrMonthMove}
            onBackward={onCurrMonthMove}
            enablePicker
          />
        ),
        rightComponent: (
          <>
            <BaseButton
              title="Today"
              type="secondary"
              size="sm"
              onPress={onTodayPress}
            />
          </>
        ),
      }}
      fabProps={{
        show: true,
        placement: 'right',
        iconName: 'plus',
        iconType: 'entypo',
        iconColor: theme.colors.white,
        color: theme.colors.color1,
        onPress: () =>
          navigation.navigate(ROUTES.transactionForm, {
            transaction_time: getDateObjFromDateStr(selectedDate).valueOf(),
          }),
      }}>
      <BaseCalendar
        currMonthStr={getFormattedDateString(currMonth)}
        selectedDate={selectedDate}
        onDayPress={onDatePress}
        dayExtraInfo={renderDayExtraInfo}
      />
      <View style={styles.transactions}>
        <View style={styles.filter}>
          <BaseFilter
            options={getFilterOptions()}
            selectedItems={selectedFilters}
            onChange={onFilterChange}
          />
        </View>
        <BaseLoadableView
          containerStyle={styles.loadableContainer}
          scrollable
          isLoading={getTransactionGroups.isLoading}>
          {getSelectedDateTransactions().length > 0 ? (
            <DailyTransactions
              timestamp={Date.parse(selectedDate)}
              transactions={getSelectedDateTransactions()}
              dailyTotal={getSelectedDateDailyTotal()}
            />
          ) : (
            <EmptyContent
              item={EmptyContentConfig.transaction}
              route={ROUTES.transactionForm}
            />
          )}
        </BaseLoadableView>
      </View>
    </BaseScreen>
  );
};

const getStyles = theme => {
  return StyleSheet.create({
    dayInfoContainer: {
      minHeight: 16,
      alignItems: 'center',
    },
    transactions: {
      marginTop: 12,
      flex: 1,
      padding: theme.spacing.xl,
      paddingTop: 16,
      backgroundColor: theme.colors.white,
      borderRadius: 20,
      shadowColor: theme.colors.black,
      shadowOffset: {
        width: 2,
        height: -5,
      },
      shadowOpacity: 0.2,
      shadowRadius: 10,
      elevation: 10,
    },
    filter: {
      marginBottom: 8,
    },
    loadableContainer: {
      flex: 1,
    },
  });
};

export default TransactionCalendarScreen;
