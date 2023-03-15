import React, { useState, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme, Header, Icon, Button, FAB } from '@rneui/themed';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import BaseText from '../../Components/BaseText';
import BaseDivider from '../../Components/BaseDivider';

import {
  CURRENCY,
  TRANSACTION_EXPENSE,
  TRANSACTION_INCOME,
} from '../../_shared/api/data/model';
import { MONTHS } from '../../_shared/constant/constant';
import ROUTES from '../../_shared/constant/routes';

const TODAY = new Date();

const TRANSACTIONS = [
  {
    id: 1,
    note: 'Dinner',
    category: 'Food',
    amount: 10,
    transaction_type: 2,
  },
  {
    id: 2,
    note: 'Salary',
    category: 'Fixed Income',
    amount: 3000,
    transaction_type: 1,
  },
  {
    id: 3,
    note: 'Uniqlo',
    category: 'Personal',
    amount: 60,
    transaction_type: 2,
  },
];

const TransactionScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  const [date, setDate] = useState(TODAY);

  const renderDate = useCallback(() => {
    const month = MONTHS[date.getMonth()];
    return `${month} ${date.getFullYear()}`;
  }, [date]);

  const moveMonth = diff => new Date(date.setMonth(date.getMonth() + diff));

  const addOneMonth = () => setDate(moveMonth(1));
  const subOneMonth = () => setDate(moveMonth(-1));

  const getAmountStyles = ({ transaction_type }) => {
    switch (transaction_type) {
      case TRANSACTION_EXPENSE:
        return styles.expenseText;
      case TRANSACTION_INCOME:
        return styles.incomeText;
    }
  };

  return (
    <SafeAreaProvider style={styles.screen}>
      <Header
        centerComponent={
          <BaseText h2 style={styles.dateText}>
            {renderDate()}
          </BaseText>
        }
        rightComponent={
          <Button onPress={addOneMonth} type="clear">
            <Icon name="chevron-right" color={theme.colors.grey3} />
          </Button>
        }
        leftComponent={
          <Button onPress={subOneMonth} type="clear">
            <Icon name="chevron-left" color={theme.colors.grey3} />
          </Button>
        }
        containerStyle={styles.header}
        rightContainerStyle={styles.headerItem}
        leftContainerStyle={styles.headerItem}
        centerContainerStyle={styles.headerItem}
      />
      <View style={styles.aggr}>
        <BaseText h4 style={styles.incomeText}>
          Income: {CURRENCY.SGD} 30000
        </BaseText>
        <BaseDivider orientation="vertical" margin={theme.spacing.lg} />
        <BaseText h4 style={styles.expenseText}>
          Expense: {CURRENCY.SGD} 300
        </BaseText>
      </View>
      <View style={styles.body}>
        {TRANSACTIONS.map(transaction => (
          <React.Fragment key={transaction.id}>
            <Button
              type="clear"
              buttonStyle={styles.transaction}
              onPress={() => navigation.navigate(ROUTES.transactionForm)}>
              <View style={styles.summary}>
                <BaseText style={styles.noteText}>{transaction.note}</BaseText>
                <BaseText caption>{transaction.category}</BaseText>
              </View>
              <BaseText
                style={getAmountStyles(
                  transaction,
                )}>{`${CURRENCY.SGD} ${transaction.amount}`}</BaseText>
            </Button>
            <BaseDivider orientation="horizontal" margin={theme.spacing.md} />
          </React.Fragment>
        ))}
      </View>
      <FAB
        placement="right"
        icon={<Icon name="add" color={theme.colors.white} />}
        color={theme.colors.primary}
        onPress={() => navigation.navigate(ROUTES.transactionForm)}
      />
    </SafeAreaProvider>
  );
};

export default TransactionScreen;

const getStyles = theme =>
  StyleSheet.create({
    screen: {
      display: 'flex',
      alignItems: 'center',
    },
    header: {
      width: '60%',
      backgroundColor: theme.colors.white,
      borderBottomColor: theme.colors.white,
      paddingVertical: theme.spacing.xl,
    },
    headerItem: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    body: {
      width: '100%',
      height: '100%',
      padding: theme.spacing.xl,
    },
    aggr: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
    },
    summary: {
      display: 'flex',
    },
    transaction: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    divider: {
      marginHorizontal: theme.spacing.lg,
    },
    dateText: {
      color: theme.colors.primary,
      textAlign: 'center',
      width: '100%',
    },
    incomeText: {
      color: theme.colors.primary,
    },
    expenseText: {
      color: theme.colors.red0,
    },
    noteText: {
      marginBottom: theme.spacing.sm,
    },
  });
