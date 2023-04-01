import { View, StyleSheet } from 'react-native';
import { ListItem, useTheme, Chip } from '@rneui/themed';

import BaseText from './BaseText';
import BaseButton from './BaseButton';
import AmountText from './AmountText';

import {
  TRANSACTION_TYPE_EXPENSE,
  TRANSACTION_TYPE_INCOME,
} from '../_shared/api/data/model';

import { DAYS } from '../_shared/constant/constant';

const DailyTransactions = ({
  timestamp = 0,
  transactions = [
    {
      id: 0,
      note: '',
      category_id: 0,
      amount: 0,
      transaction_type: TRANSACTION_TYPE_EXPENSE,
    },
  ],
}) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  const t = new Date(timestamp);

  const computeAmountSum = () => {
    let sum = 0;
    transactions.forEach(t => {
      switch (t.transaction_type) {
        case TRANSACTION_TYPE_EXPENSE:
          sum -= t.amount;
          return;
        case TRANSACTION_TYPE_INCOME:
          sum += t.amount;
          return;
      }
    });

    return sum;
  };
  return (
    <View>
      <View style={styles.titleRow}>
        <View style={styles.titleItem}>
          <BaseText h2 style={styles.titleItemText}>
            {`${t.getDay()}`.padStart(2, '0')}
          </BaseText>
          <Chip
            radius={5}
            size="sm"
            containerStyle={styles.chip}
            titleStyle={styles.chipText}>
            {DAYS[t.getDay()]}
          </Chip>
        </View>
        <AmountText showSymbol style={styles.sumText}>
          {computeAmountSum()}
        </AmountText>
      </View>
      <BaseText>DailyTransactions</BaseText>
    </View>
  );
};

export default DailyTransactions;

const getStyles = theme =>
  StyleSheet.create({
    titleRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    titleItem: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    titleItemText: {
      fontSize: 24,
      fontWeight: 'bold',
    },
    chip: {
      marginLeft: theme.spacing.lg,
    },
    chipText: {
      fontSize: 10,
      fontWeight: 'bold',
    },
    sumText: {
      fontSize: 18,
    },
  });
