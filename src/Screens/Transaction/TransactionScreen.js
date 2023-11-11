import { useState } from 'react';
import { useTheme } from '@rneui/themed';
import { View, StyleSheet } from 'react-native';

import {
  DateNavigator,
  AggrSummary,
  Transactions,
  IconButton,
  BaseScreenV2,
  BaseLoadableViewV2,
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

const TransactionScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  const [isCalendarActive, setIsCalendarActive] = useState(false);

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
      subHeader={
        !isCalendarActive && (
          <>
            <AggrSummary
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
        )
      }
      disableScroll={isCalendarActive}
      bottomSheetModalProps={{
        show: isCalendarActive,
        bodyComponent: (
          <BaseLoadableViewV2 isLoading={isLoading}>
            {transactionsComponent}
          </BaseLoadableViewV2>
        ),
        headerComponent: filterComponent,
      }}
      fabProps={{
        show: !isLoading,
        onPress: () => navigation.navigate(ROUTES.transactionForm),
      }}>
      <BaseLoadableViewV2 isLoading={isLoading}>
        {isCalendarActive ? (
          <>
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
          </>
        ) : (
          transactionsComponent
        )}
      </BaseLoadableViewV2>
    </BaseScreenV2>
  );
};

const getStyles = _ => {
  return StyleSheet.create({
    filter: {
      marginTop: 0,
      marginBottom: 8,
    },
    dayInfoContainer: {
      minHeight: 14,
      alignItems: 'center',
    },
  });
};

export default TransactionScreen;
