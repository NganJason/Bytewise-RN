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
} from '../../Components';

import ROUTES from '../../_shared/constant/routes';

import { TRANSACTIONS } from '../../_shared/api/data/mock/transaction';

const CategoryBreakdownScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  return (
    <BaseScreen
      subHeader={<BudgetUsage budget={'100'} used={'50'} />}
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
