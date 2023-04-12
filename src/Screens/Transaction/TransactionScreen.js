import React from 'react';
import { StyleSheet } from 'react-native';
import { useTheme } from '@rneui/themed';
import { ScrollView } from 'react-native-gesture-handler';

import {
  BaseScreen,
  MonthNavigator,
  DailyTransactions,
  AmountText,
  FlexRow,
  BaseText,
} from '../../Components';

import { TRANSACTIONS } from '../../_shared/api/data/mock/transaction';
import ROUTES from '../../_shared/constant/routes';

const TransactionScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  return (
    <BaseScreen
      headerProps={{
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
      <FlexRow
        rowStyle={styles.textGroupWrapper}
        showDivider
        items={[
          <>
            <BaseText h4 center style={styles.label}>
              Income:
            </BaseText>
            <AmountText h4 showColor showSymbol>
              100
            </AmountText>
          </>,
          <>
            <BaseText h4 center style={styles.label}>
              Expense:
            </BaseText>
            <AmountText h4 showColor showSymbol>
              -1000
            </AmountText>
          </>,
        ]}
      />
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
      marginBottom: 10,
    },
    label: {
      marginBottom: 4,
    },
  });
