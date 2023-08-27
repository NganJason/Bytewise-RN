import { StyleSheet, View } from 'react-native';
import {
  BaseCalendar,
  BaseLoadableView,
  BaseScreen,
  BaseText,
  DailyTransactions,
  DateNavigator,
} from '../../Components';
import { useTheme } from '@rneui/themed';
import { useState } from 'react';
import { getFormattedDateString } from '../../_shared/util';
import { useDimension } from '../../_shared/hooks';
import ROUTES from '../../_shared/constant/routes';
import { useNavigation } from '@react-navigation/native';

const transactions = [
  {
    transaction_id: '1',
    category: {
      category_id: '1',
      category_name: 'Food',
    },
    account: {
      account_id: '1',
      account_name: 'OCBC',
    },
    amount: '12',
    note: 'Lunch',
    transaction_time: 0,
    transaction_type: 0,
  },
  {
    transaction_id: '2',
    category: {
      category_id: '1',
      category_name: 'Food',
    },
    account: {
      account_id: '1',
      account_name: 'OCBC',
    },
    amount: '15',
    note: 'Breakfast',
    transaction_time: 0,
    transaction_type: 0,
  },
  {
    transaction_id: '3',
    category: {
      category_id: '1',
      category_name: 'Food',
    },
    account: {
      account_id: '1',
      account_name: 'OCBC',
    },
    amount: '20',
    note: 'Dinner',
    transaction_time: 0,
    transaction_type: 0,
  },
];

const TransactionCalendarScreen = () => {
  const { theme } = useTheme();
  const { screenHeight } = useDimension();
  const styles = getStyles(theme, screenHeight);
  const navigation = useNavigation();

  const [currMonth, setCurrMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(getFormattedDateString());

  const onCurrMonthMove = e => {
    setCurrMonth(e);
  };

  const onDatePress = e => {
    setSelectedDate(e.dateString);
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
        onPress: () => navigation.navigate(ROUTES.transactionForm),
      }}>
      <BaseCalendar
        currMonthStr={getFormattedDateString(currMonth)}
        selectedDate={selectedDate}
        onDayPress={onDatePress}
        dayTextContainerStyle={styles.dayTextContainer}
        dayExtraInfo={
          <>
            <BaseText text6 margin={{ top: 6 }} color={theme.colors.regularRed}>
              100
            </BaseText>
            <BaseText text6 color={theme.colors.color1}>
              200
            </BaseText>
          </>
        }
      />
      <BaseLoadableView containerStyle={styles.transactions} scrollable>
        <DailyTransactions transactions={transactions} />
      </BaseLoadableView>
    </BaseScreen>
  );
};

const getStyles = theme => {
  return StyleSheet.create({
    dayTextContainer: {
      marginVertical: -6,
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
