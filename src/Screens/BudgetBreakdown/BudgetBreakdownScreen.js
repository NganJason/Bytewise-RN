import React from 'react';
import { StyleSheet, ScrollView, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useTheme, Header, LinearProgress, Icon } from '@rneui/themed';
import BaseText from '../../Components/BaseText';
import BaseDivider from '../../Components/BaseDivider';

import {
  CURRENCY,
  TRANSACTION_EXPENSE,
  TRANSACTION_INCOME,
} from '../../_shared/api/data/model';
import ArrowSelector from '../../Components/ArrowSelector';
import useSetDate from '../../_shared/hooks/useSetDate';

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

const BudgetBreakdownScreen = () => {
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
    <SafeAreaProvider>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <Header
          centerComponent={
            <>
              <BaseText h2 style={{ color: theme.colors.primary }}>
                Food
              </BaseText>

              <ArrowSelector
                contentSpacing={theme.spacing.sm}
                onPrev={subOneMonth}
                onNext={addOneMonth}>
                <BaseText h3 style={styles.dateHeader}>
                  {renderDate()}
                </BaseText>
              </ArrowSelector>
            </>
          }
          containerStyle={styles.header}
        />

        <View style={styles.aggr}>
          <BaseText h3 style={{ color: theme.colors.primary }}>
            Budget: {100}
          </BaseText>
          <BaseDivider orientation="vertical" margin={theme.spacing.lg} />
          <BaseText h3 style={{ color: theme.colors.red0 }}>
            Used: {200}
          </BaseText>
        </View>

        <LinearProgress
          trackColor={theme.colors.secondary}
          color={theme.colors.primary}
          style={styles.progressBar}
          value={0.2}
        />

        <View style={styles.body}>
          {TRANSACTIONS.map(transaction => (
            <React.Fragment key={transaction.id}>
              <View style={styles.transaction}>
                <View style={styles.summary}>
                  <BaseText style={styles.noteText}>
                    {transaction.note}
                  </BaseText>
                  <BaseText caption>{transaction.category}</BaseText>
                </View>
                <BaseText
                  style={getAmountStyles(
                    transaction,
                  )}>{`${CURRENCY.SGD} ${transaction.amount}`}</BaseText>
              </View>
              <BaseDivider orientation="horizontal" margin={theme.spacing.lg} />
            </React.Fragment>
          ))}
        </View>
      </ScrollView>
    </SafeAreaProvider>
  );
};

const getStyles = theme => {
  return StyleSheet.create({
    scrollView: {
      flexGrow: 1,
    },
    header: {
      alignSelf: 'center',
      alignItems: 'center',
      backgroundColor: theme.colors.white,
      paddingVertical: theme.spacing.md,
      marginBottom: theme.spacing.sm,
      borderBottomColor: theme.colors.white,
      width: '90%',
    },
    dateHeader: {
      marginHorizontal: theme.spacing.md,
      color: theme.colors.primary,
    },
    aggr: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginTop: theme.spacing.sm,
    },
    progressBar: {
      height: 2,
      width: '80%',
      alignSelf: 'center',
      marginVertical: theme.spacing.sm,
    },
    body: {
      width: '100%',
      height: '100%',
      padding: theme.spacing.xl,
    },
    transaction: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    summary: {
      display: 'flex',
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
};

export default BudgetBreakdownScreen;
