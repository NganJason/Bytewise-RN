import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useTheme } from '@rneui/themed';
import {
  BaseText,
  BaseScreen,
  DailyTransactions,
  BaseLinearProgress,
  IconButton,
  AggrSummary,
  BaseScrollView,
} from '../../Components';

import ROUTES from '../../_shared/constant/routes';

import { TRANSACTIONS } from '../../_shared/api/data/mock/transaction';

const BudgetBreakdownScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  return (
    <BaseScreen
      headerProps={{
        allowBack: true,
        centerComponent: (
          <>
            <BaseText h1 style={styles.categoryNameText}>
              Food
            </BaseText>
            <BaseText caption h4>
              Jan 2023
            </BaseText>
          </>
        ),
        rightComponent: (
          <IconButton
            iconName="edit"
            iconType="fontawesome"
            type="clear"
            onPress={() => {
              navigation.navigate(ROUTES.categoryForm);
            }}
          />
        ),
      }}>
      <View style={styles.subHeader}>
        <AggrSummary
          aggrs={[
            { label: 'Budget', amount: '100' },
            { label: 'Used', amount: '-1000' },
          ]}
        />
        <BaseLinearProgress value={0.2} />
      </View>
      <BaseScrollView showsVerticalScrollIndicator={false}>
        {TRANSACTIONS.map((t, i) => (
          <DailyTransactions
            key={i}
            transactions={t.transactions}
            timestamp={t.timestamp}
          />
        ))}
      </BaseScrollView>
    </BaseScreen>
  );
};

const getStyles = theme => {
  return StyleSheet.create({
    subHeader: {
      marginBottom: 16,
    },
    budgetTypeText: {
      marginBottom: 16,
    },
    categoryNameText: {
      marginBottom: 4,
      color: theme.colors.color1,
    },
  });
};

export default BudgetBreakdownScreen;
