import React, { useState, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme, Icon, Button, FAB } from '@rneui/themed';

import {
  BaseText,
  BaseDivider,
  BaseScreen,
  BaseHeader,
  ArrowSelector,
} from '../../Components';

import {
  CURRENCY,
  TRANSACTION_EXPENSE,
  TRANSACTION_INCOME,
} from '../../_shared/api/data/model';
import { MONTHS } from '../../_shared/constant/constant';
import ROUTES from '../../_shared/constant/routes';
import useSetDate from '../../_shared/hooks/useSetDate';

const TODAY = new Date();

// TODO: REMOVE
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

  const { renderDate, addOneMonth, subOneMonth } = useSetDate();

  const getAmountStyles = ({ transaction_type }) => {
    switch (transaction_type) {
      case TRANSACTION_EXPENSE:
        return styles.expenseText;
      case TRANSACTION_INCOME:
        return styles.incomeText;
    }
  };

  return (
    <BaseScreen
      fab={
        <FAB
          placement="right"
          icon={<Icon name="add" color={theme.colors.white} />}
          color={theme.colors.primary}
          onPress={() => navigation.navigate(ROUTES.transactionForm)}
        />
      }>
      <BaseHeader
        centerComponent={
          <ArrowSelector
            contentSpacing={theme.spacing.xl}
            onNext={addOneMonth}
            onPrev={subOneMonth}>
            <BaseText h2 style={{ color: theme.colors.primary }}>
              {renderDate()}
            </BaseText>
          </ArrowSelector>
        }
        centerContainerStyle={styles.headerItem}
      />
      <View style={styles.aggr}>
        <BaseText h3 style={styles.incomeText}>
          Income: {CURRENCY.SGD} 30000
        </BaseText>
        <BaseDivider orientation="vertical" margin={theme.spacing.lg} />
        <BaseText h3 style={styles.expenseText}>
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
    </BaseScreen>
  );
};

export default TransactionScreen;

const getStyles = theme =>
  StyleSheet.create({
    screen: {
      display: 'flex',
      alignItems: 'center',
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
