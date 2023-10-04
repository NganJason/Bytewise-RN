import { View, StyleSheet } from 'react-native';
import {
  BaseButton,
  BaseCalendar,
  BaseLoadableView,
  BaseScreen,
  BaseText,
  DateNavigator,
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
} from '../../_shared/util';
import {
  useDimension,
  useError,
  useTransactionGroups,
} from '../../_shared/hooks';
import ROUTES from '../../_shared/constant/routes';
import { useNavigation } from '@react-navigation/native';
import { BaseFilter, Transactions } from '../../Components/Common';

const TransactionCalendarScreen = () => {
  const { theme } = useTheme();
  const { screenHeight } = useDimension();
  const styles = getStyles(theme, screenHeight);
  const navigation = useNavigation();

  const [selectedDate, setSelectedDate] = useState(getFormattedDateString());
  const [currMonth, setCurrMonth] = useState(new Date());

  const {
    setTimeRange,
    selectedFilters,
    getDailyTotalExpenseIncome,
    getTransactionGroupByDateStr,
    getFilterOptions,
    onFilterChange,
    isLoading,
    getErrors,
  } = useTransactionGroups(currMonth);
  useEffect(() => {
    setTimeRange(getUnixRangeOfMonth(getYear(currMonth), getMonth(currMonth)));
  }, [currMonth]);

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

  useError(getErrors());

  const renderDayExtraInfo = date => {
    const { dateString } = date;
    const [expense, income] = getDailyTotalExpenseIncome(dateString);

    return (
      <View style={styles.dayInfoContainer}>
        {Math.abs(expense) > 0 && (
          <BaseText text6 margin={{ top: 0 }} color={theme.colors.regularRed}>
            {expense.toFixed(2)}
          </BaseText>
        )}
        {Math.abs(income) > 0 && (
          <BaseText text6 color={theme.colors.color1}>
            {income.toFixed(2)}
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
          isLoading={isLoading}>
          <Transactions
            transactionGroups={[getTransactionGroupByDateStr(selectedDate)]}
          />
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
