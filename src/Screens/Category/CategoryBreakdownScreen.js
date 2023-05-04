import React from 'react';
import { StyleSheet } from 'react-native';
import { useTheme } from '@rneui/themed';
import {
  BaseText,
  BaseScreen,
  DailyTransactions,
  IconButton,
  BaseScrollView,
  BudgetUsage,
  DateNavigator,
} from '../../Components';

import ROUTES from '../../_shared/constant/routes';

import { TRANSACTIONS } from '../../_shared/api/mock_data/transaction';
import { useNavigation } from '@react-navigation/native';

const CategoryBreakdownScreen = () => {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const navigation = useNavigation();

  return (
    <BaseScreen
      subHeader={
        <BudgetUsage
          budget={'100'}
          used={'50'}
          onPress={() => navigation.navigate(ROUTES.budgetForm)}
        />
      }
      headerProps={{
        allowBack: true,
        centerComponent: (
          <>
            <BaseText h1 style={styles.categoryNameText}>
              Food
            </BaseText>
            <DateNavigator h3 />
          </>
        ),
        rightComponent: (
          <IconButton
            buttonSize="xs"
            type="clear"
            iconName="edit"
            iconType="fontawesome"
            align="left"
            onPress={() => {
              navigation.navigate(ROUTES.categoryForm);
            }}
          />
        ),
      }}>
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
    categoryNameText: {
      marginBottom: 4,
      color: theme.colors.color1,
    },
  });
};

export default CategoryBreakdownScreen;
