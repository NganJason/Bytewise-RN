import React from 'react';
import { StyleSheet } from 'react-native';
import { useTheme } from '@rneui/themed';
import { ScrollView } from 'react-native-gesture-handler';

import {
  BaseText,
  BaseScreen,
  BaseHeader,
  ArrowSelector,
  DailyTransactions,
} from '../../Components';

import { TRANSACTIONS } from '../../_shared/api/data/mock/transaction';
import ROUTES from '../../_shared/constant/routes';
import useSetDate from '../../_shared/hooks/useSetDate';

const TransactionScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  const { renderDate, addOneMonth, subOneMonth } = useSetDate();

  return (
    <BaseScreen
      fabProps={{
        show: true,
        placement: 'right',
        iconName: 'add',
        iconColor: theme.colors.white,
        color: theme.colors.primary,
        onPress: () => navigation.navigate(ROUTES.transactionForm),
      }}>
      <BaseHeader
        center={
          <ArrowSelector
            contentSpacing={theme.spacing.xl}
            onNext={addOneMonth}
            onPrev={subOneMonth}>
            <BaseText h1 style={{ color: theme.colors.color1 }}>
              {renderDate()}
            </BaseText>
          </ArrowSelector>
        }
      />
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

export default TransactionScreen;

const getStyles = _ =>
  StyleSheet.create({
    body: {
      flex: 1,
      width: '100%',
      height: '100%',
    },
  });
