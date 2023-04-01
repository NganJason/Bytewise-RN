import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme, Icon, FAB } from '@rneui/themed';

import {
  BaseText,
  BaseScreen,
  BaseHeader,
  ArrowSelector,
  DailyTransactions,
} from '../../Components';

import ROUTES from '../../_shared/constant/routes';
import useSetDate from '../../_shared/hooks/useSetDate';

const TransactionScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  const { renderDate, addOneMonth, subOneMonth } = useSetDate();

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
      <View style={styles.body}>
        <DailyTransactions />
      </View>
    </BaseScreen>
  );
};

export default TransactionScreen;

const getStyles = theme =>
  StyleSheet.create({
    headerItem: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    body: {
      width: '100%',
      height: '100%',
      paddingVertical: theme.spacing.xl,
    },
  });
