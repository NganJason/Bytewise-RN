import { useState } from 'react';
import { useTheme } from '@rneui/themed';
import { View, StyleSheet } from 'react-native';

import {
  DateNavigator,
  AggrSummary,
  Transactions,
  IconButton,
  BaseScreenV2,
  BaseCalendar,
  BaseText,
  BaseButton,
} from '../../Components';
import {
  getUnixRangeOfMonth,
  getYear,
  getMonth,
  getFormattedDateString,
  getDateObjFromDateStr,
} from '../../_shared/util';
import ROUTES from '../../_shared/constant/routes';
import {
  TRANSACTION_TYPE_EXPENSE,
  TRANSACTION_TYPE_INCOME,
  TRANSACTION_TYPES,
} from '../../_shared/apis/enum';
import { useError, useTransactionGroups } from '../../_shared/hooks';
import { BaseFilter } from '../../Components/Common';

const TODAY = new Date();
const defaultBottomSpace = 80;

const TransactionScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  const [isCalendarActive, setIsCalendarActive] = useState(false);
  const [calendarBottomSheetHeight, setCalendarBottomHeight] = useState(100);

  const [disableScroll] = useState(false);

  const [activeDate, setActiveDate] = useState(TODAY);
  const {
    setTimeRange,
    transactionGroups,
    getMonthlyTotalIncome,
    getMonthlyTotalExpense,
    getDailyTotalExpenseIncome,
    getTransactionGroupByDateStr,
    selectedFilters,
    getFilterOptions,
    onFilterChange,
    isLoading,
    getErrors,
  } = useTransactionGroups(activeDate);

  const onDateMove = newDate => {
    setActiveDate(newDate);
    setTimeRange(getUnixRangeOfMonth(getYear(newDate), getMonth(newDate)));
  };

  const onTodayPress = () => {
    setActiveDate(new Date());
  };

  const onDayPress = e => {
    setActiveDate(getDateObjFromDateStr(e.dateString));
  };

  const onBottomPlaceholderLayout = e => {
    const { height } = e.nativeEvent.layout;
    setCalendarBottomHeight(height + defaultBottomSpace);
  };
  const renderDayExtraInfo = date => {
    const { dateString } = date;
    const [expense, income] = getDailyTotalExpenseIncome(dateString);

    return (
      <View style={styles.dayInfoContainer}>
        {Math.abs(expense) > 0 && (
          <BaseText text7 margin={{ top: 0 }} color={theme.colors.regularRed}>
            {expense.toFixed(2)}
          </BaseText>
        )}
        {Math.abs(income) > 0 && (
          <BaseText text7 color={theme.colors.color1}>
            {income.toFixed(2)}
          </BaseText>
        )}
      </View>
    );
  };

  const transactionsComponent = (
    <Transactions
      transactionGroups={
        isCalendarActive
          ? [getTransactionGroupByDateStr(getFormattedDateString(activeDate))]
          : transactionGroups
      }
    />
  );

  const filterComponent = (
    <View style={styles.filter}>
      <BaseFilter
        options={getFilterOptions()}
        selectedItems={selectedFilters}
        onChange={onFilterChange}
      />
    </View>
  );

  useError(getErrors());

  return (
    <BaseScreenV2
      isLoading={isLoading}
      hideInfoButtonProps={{ show: true }}
      drawerButtonProps={{ show: true }}
      headerProps={{
        allowBack: false,
        allowDrawer: true,
        leftComponent: (
          <IconButton
            iconName="calendar"
            iconType="font-awesome"
            iconSize={22}
            onPress={() => setIsCalendarActive(!isCalendarActive)}
            color={isCalendarActive ? theme.colors.color1 : theme.colors.color7}
          />
        ),
        centerComponent: (
          <DateNavigator
            date={activeDate}
            onForward={onDateMove}
            onBackward={onDateMove}
            enablePicker
          />
        ),
      }}
      subHeaderProps={{
        subHeader: !isCalendarActive ? (
          <>
            <AggrSummary
              isLoading={isLoading}
              aggrs={[
                {
                  label: TRANSACTION_TYPES[TRANSACTION_TYPE_INCOME],
                  amount: getMonthlyTotalIncome(),
                  sensitive: true,
                },
                {
                  label: TRANSACTION_TYPES[TRANSACTION_TYPE_EXPENSE],
                  amount: getMonthlyTotalExpense(),
                  sensitive: true,
                },
              ]}
            />
            {filterComponent}
          </>
        ) : null,
      }}
      disableScroll={isCalendarActive || disableScroll}
      bottomSheetModalProps={{
        show: isCalendarActive,
        bodyComponent: transactionsComponent,
        isLoading: isLoading,
        headerComponent: filterComponent,
        snapPoints: [calendarBottomSheetHeight, '70%', '90%'],
      }}
      fabProps={{
        show: true,
        onPress: () => navigation.navigate(ROUTES.transactionForm),
      }}>
      {isCalendarActive ? (
        <>
          <View>
            <BaseButton
              title="Today"
              type="secondary"
              size="sm"
              onPress={onTodayPress}
              align="flex-end"
              margin={{ bottom: 4 }}
            />
            <BaseCalendar
              currMonthStr={getFormattedDateString(activeDate)}
              selectedDate={getFormattedDateString(activeDate)}
              onDayPress={onDayPress}
              dayExtraInfo={renderDayExtraInfo}
            />
          </View>
          <View
            style={styles.calendarBottomPlaceholder}
            onLayout={onBottomPlaceholderLayout}
          />
        </>
      ) : (
        transactionsComponent
      )}
    </BaseScreenV2>
  );
};

const getStyles = _ => {
  return StyleSheet.create({
    filter: {
      marginTop: 0,
    },
    dayInfoContainer: {
      minHeight: 14,
      alignItems: 'center',
    },
    calendarBottomPlaceholder: {
      flex: 1,
    },
  });
};

export default TransactionScreen;
