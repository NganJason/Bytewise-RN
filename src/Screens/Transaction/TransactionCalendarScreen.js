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
  groupTransactionsByDateStr,
} from '../../_shared/util';
import { useDimension, useError } from '../../_shared/hooks';
import ROUTES from '../../_shared/constant/routes';
import { useNavigation } from '@react-navigation/native';
import { EmptyContentConfig } from '../../_shared/constant/constant';
import { useGetTransactions } from '../../_shared/query';

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

  const getTransactions = useGetTransactions({
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
    getTransactions?.data?.transactions || [],
  );
  const getSelectedDateTransactions = () => {
    return dateStrToTransactions[selectedDate]?.transactions || [];
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

  useError([getTransactions]);

  const renderDayExtraInfo = date => {
    let totalIncome = Math.abs(
      dateStrToTransactions[date.dateString]?.totalIncome || 0,
    );

    let totalExpense = Math.abs(
      dateStrToTransactions[date.dateString]?.totalExpense || 0,
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
          <BaseButton
            title="Today"
            type="secondary"
            size="sm"
            onPress={onTodayPress}
          />
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
        <BaseLoadableView
          containerStyle={styles.loadableContainer}
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
    loadableContainer: {
      flex: 1,
    },
  });
};

export default TransactionCalendarScreen;
