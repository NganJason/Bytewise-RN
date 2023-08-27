import { StyleSheet } from 'react-native';
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
  getFirstDayOfMonthFormatted,
  getFormattedDateString,
  getMonth,
  getUnixRangeOfMonth,
  getYear,
  groupTransactionsByDateStr,
} from '../../_shared/util';
import { useDimension, useError } from '../../_shared/hooks';
import ROUTES from '../../_shared/constant/routes';
import { useNavigation } from '@react-navigation/native';
import { useGetTransactionsHook } from '../../_shared/hooks/transaction';
import { EmptyContentConfig } from '../../_shared/constant/constant';

const PAGING_LIMIT = 500;
const STARTING_PAGE = 1;

const TransactionCalendarScreen = () => {
  const { theme } = useTheme();
  const { screenHeight } = useDimension();
  const styles = getStyles(theme, screenHeight);
  const navigation = useNavigation();

  const [currMonth, setCurrMonth] = useState(new Date());
  const [timeRange, setTimeRange] = useState(
    getUnixRangeOfMonth(getYear(currMonth), getMonth(currMonth)),
  );
  useEffect(() => {
    setTimeRange(getUnixRangeOfMonth(getYear(currMonth), getMonth(currMonth)));
  }, [currMonth]);

  const getTransactions = useGetTransactionsHook({
    transaction_time: {
      gte: timeRange[0],
      lte: timeRange[1],
    },
    paging: {
      limit: PAGING_LIMIT,
      page: STARTING_PAGE,
    },
  });

  let dateStrToTransactions = groupTransactionsByDateStr(
    getTransactions?.transactions || [],
  );
  const getSelectedDateTransactions = () => {
    return dateStrToTransactions[selectedDate]?.transactions || [];
  };

  const [selectedDate, setSelectedDate] = useState(getFormattedDateString());

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

  useError([getTransactions]);

  const renderDayExtraInfo = date => {
    let totalIncome = Math.abs(
      dateStrToTransactions[date.dateString]?.totalIncome || 0,
    );

    let totalExpense = Math.abs(
      dateStrToTransactions[date.dateString]?.totalExpense || 0,
    );

    return (
      <>
        <BaseText text6 margin={{ top: 6 }} color={theme.colors.regularRed}>
          {totalExpense > 0 ? totalExpense.toFixed(2) : ''}
        </BaseText>
        <BaseText text6 color={theme.colors.color1}>
          {totalIncome > 0 ? totalIncome.toFixed(2) : ''}
        </BaseText>
      </>
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
          <BaseButton title="T" type="secondary" onPress={onTodayPress} />
        ),
      }}
      fabProps={{
        show: true,
        placement: 'right',
        iconName: 'plus',
        iconType: 'entypo',
        iconColor: theme.colors.white,
        color: theme.colors.color1,
        onPress: () => navigation.navigate(ROUTES.transactionForm),
      }}>
      <BaseCalendar
        currMonthStr={getFormattedDateString(currMonth)}
        selectedDate={selectedDate}
        onDayPress={onDatePress}
        dayTextContainerStyle={styles.dayTextContainer}
        dayExtraInfo={renderDayExtraInfo}
      />
      <BaseLoadableView
        containerStyle={styles.transactions}
        scrollable
        isLoading={getTransactions.isLoading}>
        {getSelectedDateTransactions().length > 0 ? (
          <DailyTransactions
            timestamp={Date.parse(selectedDate)}
            transactions={getSelectedDateTransactions()}
          />
        ) : (
          <EmptyContent
            item={EmptyContentConfig.transaction}
            route={ROUTES.transactionForm}
          />
        )}
      </BaseLoadableView>
    </BaseScreen>
  );
};

const getStyles = theme => {
  return StyleSheet.create({
    dayTextContainer: {
      marginVertical: -8,
    },
    transactions: {
      marginTop: 12,
      flex: 1,
      padding: theme.spacing.xl,
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
  });
};

export default TransactionCalendarScreen;
