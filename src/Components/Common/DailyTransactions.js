import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme, Chip } from '@rneui/themed';
import { useNavigation } from '@react-navigation/native';

import BaseText from '../Text/BaseText';
import AmountText from '../Text/AmountText';
import BaseListItem from '../View/BaseListItem';

import {
  TRANSACTION_TYPE_EXPENSE,
  TRANSACTION_TYPE_INCOME,
} from '../../_shared/apis/enum';

import ROUTES from '../../_shared/constant/routes';
import { DAYS } from '../../_shared/constant/constant';
import { getDate, getDay } from '../../_shared/util/date';
import { BaseChip } from '../View';

const DailyTransactions = ({
  timestamp = 0,
  transactions = [
    {
      transaction_id: '',
      category: {
        category_id: '',
        category_name: '',
      },
      amount: '',
      note: '',
      transaction_time: 0,
      transaction_type: 0,
    },
  ],
}) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  const ts = new Date(timestamp);

  const navigation = useNavigation();

  const computeAmountSum = () => {
    let sum = 0;
    transactions.forEach(t => {
      switch (t.transaction_type) {
        case TRANSACTION_TYPE_EXPENSE:
          sum -= Number(t.amount);
          return;
        case TRANSACTION_TYPE_INCOME:
          sum += Number(t.amount);
          return;
      }
    });

    return sum;
  };

  const navigateToForm = t => {
    navigation.navigate(ROUTES.transactionForm, {
      transaction_id: t.transaction_id,
    });
  };

  const renderTransactionAmount = (amount, transactionType) => {
    switch (transactionType) {
      case TRANSACTION_TYPE_EXPENSE:
        return amount * -1;
      case TRANSACTION_TYPE_INCOME:
        return amount;
    }
  };

  return (
    <View style={styles.body}>
      <View style={styles.row}>
        <View style={styles.titleItem}>
          <BaseText text1 style={styles.titleItemText}>
            {`${getDate(ts)}`.padStart(2, '0')}
          </BaseText>
          <BaseChip>{DAYS[getDay(ts)]}</BaseChip>
        </View>
        <AmountText showColor style={styles.sumText}>
          {computeAmountSum()}
        </AmountText>
      </View>
      {transactions.map((t, i) => {
        return (
          <TouchableOpacity key={i} onPress={() => navigateToForm(t)}>
            <BaseListItem
              containerStyle={styles.listItem}
              showDivider
              dividerMargin={4}>
              <View style={styles.listItemContent}>
                <BaseText
                  text5
                  style={styles.category}
                  numberOfLines={1}
                  ellipsizeMode="tail">
                  {t.category.category_name}
                </BaseText>
                <View style={styles.noteWrapper}>
                  <BaseText
                    text3
                    style={styles.note}
                    numberOfLines={1}
                    ellipsizeMode="tail">
                    {t.note}
                  </BaseText>
                </View>
                <AmountText
                  text5
                  style={styles.amount}
                  numberOfLines={1}
                  showSymbol
                  ellipsizeMode="tail">
                  {renderTransactionAmount(t.amount, t.transaction_type)}
                </AmountText>
              </View>
            </BaseListItem>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default DailyTransactions;

const getStyles = theme =>
  StyleSheet.create({
    body: {
      marginBottom: 26,
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 6,
    },
    titleItem: {
      flex: 2,
      flexDirection: 'row',
      alignItems: 'center',
    },
    titleItemText: {
      fontWeight: 'bold',
    },
    sumText: {
      flex: 1,
      textAlign: 'right',
      ...theme.fontStyles.text3,
    },
    listItem: {
      paddingHorizontal: 0,
    },
    listItemContent: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    category: {
      flex: 1,
      color: theme.colors.color6,
    },
    account: {
      color: theme.colors.color6,
    },
    noteWrapper: {
      flex: 2,
      marginHorizontal: 10,
    },
    note: {
      marginBottom: 2,
    },
    amount: {
      flex: 1,
      textAlign: 'right',
      ...theme.fontStyles.text3,
    },
  });
