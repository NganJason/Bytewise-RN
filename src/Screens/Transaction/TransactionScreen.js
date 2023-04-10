import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useTheme } from '@rneui/themed';
import { ScrollView } from 'react-native-gesture-handler';

import {
  BaseScreen,
  MonthNavigator,
  DailyTransactions,
  TextGroup,
  AmountText,
} from '../../Components';

import { TRANSACTIONS } from '../../_shared/api/data/mock/transaction';
import ROUTES from '../../_shared/constant/routes';

const TransactionScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  return (
    <BaseScreen
      headerProps={{
        show: true,
        allowBack: false,
        centerComponent: <MonthNavigator />,
      }}
      fabProps={{
        show: true,
        placement: 'right',
        iconName: 'add',
        iconColor: theme.colors.white,
        color: theme.colors.primary,
        onPress: () => navigation.navigate(ROUTES.transactionForm),
      }}>
      <View style={styles.textGroupWrapper}>
        <TextGroup
          texts={[
            { label: 'Income: ', value: '100' },
            { label: 'Expense: ', value: '-1000' },
          ]}
          ValueComponent={AmountText}
        />
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
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

export default TransactionScreen;

const getStyles = _ =>
  StyleSheet.create({
    textGroupWrapper: {
      paddingBottom: 18,
    },
  });
