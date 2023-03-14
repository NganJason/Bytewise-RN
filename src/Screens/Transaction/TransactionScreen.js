import { useState, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme, Header, Icon, Button, Divider } from '@rneui/themed';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import BaseText from '../../Components/BaseText';

import { CURRENCY } from '../../_shared/api/data/model';
import { MONTHS } from '../../_shared/constant/constant';

const TODAY = new Date();

const TransactionScreen = () => {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  const [date, setDate] = useState(TODAY);

  const renderDate = useCallback(() => {
    const month = MONTHS[date.getMonth()];
    return `${month} ${date.getFullYear()}`;
  }, [date]);

  const moveMonth = diff => new Date(date.setMonth(date.getMonth() + diff));

  const addOneMonth = () => setDate(moveMonth(1));
  const subOneMonth = () => setDate(moveMonth(-1));

  return (
    <SafeAreaProvider style={styles.screen}>
      <Header
        centerComponent={
          <BaseText h2 style={styles.dateText}>
            {renderDate()}
          </BaseText>
        }
        rightComponent={
          <Button onPress={addOneMonth} type="clear">
            <Icon name="chevron-right" color={theme.colors.primary} />
          </Button>
        }
        leftComponent={
          <Button onPress={subOneMonth} type="clear">
            <Icon name="chevron-left" color={theme.colors.primary} />
          </Button>
        }
        containerStyle={styles.header}
        rightContainerStyle={styles.headerItem}
        leftContainerStyle={styles.headerItem}
        centerContainerStyle={styles.headerItem}
      />
      <View style={styles.body}>
        <View style={styles.aggr}>
          <BaseText h4 style={styles.incomeText}>
            Income: {CURRENCY.SGD} 30000
          </BaseText>
          <Divider
            orientation="vertical"
            style={styles.divider}
            color={theme.colors.grey1}
          />
          <BaseText h4 style={styles.expenseText}>
            Expense: {CURRENCY.SGD} 300
          </BaseText>
        </View>
      </View>
    </SafeAreaProvider>
  );
};

export default TransactionScreen;

const getStyles = theme =>
  StyleSheet.create({
    screen: {
      display: 'flex',
      alignItems: 'center',
    },
    header: {
      width: '70%',
      backgroundColor: theme.colors.white,
      borderBottomColor: theme.colors.white,
      paddingVertical: theme.spacing.xl,
    },
    headerItem: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    body: {
      width: '100%',
      height: '100%',
      paddingHorizontal: theme.spacing.xl,
    },
    aggr: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
    },
    divider: {
      marginHorizontal: theme.spacing.lg,
    },
    dateText: {
      color: theme.colors.primary,
      textAlign: 'center',
      width: '100%',
    },
    incomeText: {
      color: theme.colors.primary,
    },
    expenseText: {
      color: theme.colors.red0,
    },
  });
