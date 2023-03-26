import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useTheme, LinearProgress, Icon } from '@rneui/themed';
import {
  BaseDivider,
  BaseText,
  BaseScreen,
  BaseButton,
} from '../../Components';

import {
  CURRENCY,
  TRANSACTION_EXPENSE,
  TRANSACTION_INCOME,
} from '../../_shared/api/data/model';
import ROUTES from '../../_shared/constant/routes';

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

const BUDGET = {
  category: 'Food',
  budgetType: 1,
  budget: '200',
  used: '100',
  currency: 'SGD',
  ctime: 1673153014,
  mtime: 1673153014,
};

const BudgetBreakdownScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  const getAmountStyles = ({ transaction_type }) => {
    switch (transaction_type) {
      case TRANSACTION_EXPENSE:
        return styles.expenseText;
      case TRANSACTION_INCOME:
        return styles.incomeText;
    }
  };

  return (
    <BaseScreen style={styles.screen}>
      <View style={styles.header}>
        <View style={styles.primaryHeader}>
          <BaseText h1 style={{ color: theme.colors.primary }}>
            Food
          </BaseText>
          <BaseButton
            buttonStyle={styles.editBtn}
            align="flex-end"
            onPress={() => {
              navigation.navigate(ROUTES.setCategory, {
                isEdit: true,
                data: BUDGET,
              });
            }}>
            <Icon name="edit" type="fontawesome" color={theme.colors.grey3} />
          </BaseButton>
        </View>

        <View style={styles.aggr}>
          <BaseText h3 style={{ color: theme.colors.primary }}>
            Budget: {100}
          </BaseText>
          <BaseDivider orientation="vertical" margin={theme.spacing.lg} />
          <BaseText h3 style={{ color: theme.colors.red0 }}>
            Used: {200}
          </BaseText>
        </View>

        <BaseText h3 style={{ color: theme.colors.primary }}>
          Monthly budget
        </BaseText>

        <LinearProgress
          trackColor={theme.colors.secondary}
          color={theme.colors.primary}
          style={styles.progressBar}
          value={0.2}
        />
      </View>

      <View style={styles.body}>
        {TRANSACTIONS.map(transaction => (
          <React.Fragment key={transaction.id}>
            <View style={styles.transaction}>
              <View style={styles.summary}>
                <BaseText style={styles.noteText}>{transaction.note}</BaseText>
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
    </BaseScreen>
  );
};

const getStyles = theme => {
  return StyleSheet.create({
    screen: {
      padding: theme.spacing.xl,
    },
    header: {
      marginTop: theme.spacing.xl,
      marginBottom: theme.spacing.lg,
      width: '100%',
    },
    primaryHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '100%',
    },
    editBtn: {
      backgroundColor: 'white',
    },
    aggr: {
      flexDirection: 'row',
      marginVertical: theme.spacing.xl,
    },
    progressBar: {
      height: 2,
      width: '100%',
      marginVertical: theme.spacing.xl,
    },
    body: {
      width: '100%',
      height: '100%',
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
