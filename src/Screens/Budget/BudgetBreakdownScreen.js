import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { useTheme, LinearProgress, Icon } from '@rneui/themed';
import {
  BaseDivider,
  BaseText,
  BaseScreen,
  BaseButton,
  BaseHeader,
  DailyTransactions,
} from '../../Components';

import ROUTES from '../../_shared/constant/routes';

import { TRANSACTIONS } from '../../_shared/api/data/mock/transaction';

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

  return (
    <BaseScreen>
      {/* <BaseHeader
        left={
          <BaseText h1 style={{ color: theme.colors.color1 }}>
            Food
          </BaseText>
        }
        right={
          <BaseButton
            buttonStyle={styles.editBtn}
            align="flex-end"
            onPress={() => {
              navigation.navigate(ROUTES.setCategory, {
                isEdit: true,
                data: BUDGET,
              });
            }}>
            <Icon name="edit" type="fontawesome" color={theme.colors.color5} />
          </BaseButton>
        }
      /> */}

      <View style={styles.header}>
        <View style={styles.aggr}>
          <BaseText h4 style={{ color: theme.colors.color1 }}>
            Budget: {100}
          </BaseText>
          <BaseDivider orientation="vertical" margin={theme.spacing.lg} />
          <BaseText h4 style={{ color: theme.colors.red }}>
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

      <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
        {TRANSACTIONS.map((t, i) => (
          <DailyTransactions
            key={i}
            transactions={t.transactions}
            timestamp={t.timestamp}
          />
        ))}
      </ScrollView>
    </BaseScreen>
  );
};

const getStyles = theme => {
  return StyleSheet.create({
    body: {
      flex: 1,
      width: '100%',
      height: '100%',
    },
    header: {
      marginBottom: theme.spacing.lg,
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
