import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { ListItem, useTheme, Chip } from '@rneui/themed';
import { useNavigation } from '@react-navigation/native';

import BaseText from '../Text/BaseText';
import AmountText from '../Text/AmountText';

import {
  TRANSACTION_TYPE_EXPENSE,
  TRANSACTION_TYPE_INCOME,
} from '../../_shared/api/data/model';

import {
  EXPENSE_CATEGORIES,
  INCOME_CATEGORIES,
} from '../../_shared/api/data/mock/category';

import { ACCOUNTS } from '../../_shared/api/data/mock/account';

import ROUTES from '../../_shared/constant/routes';

import { DAYS } from '../../_shared/constant/constant';

const DailyTransactions = ({
  timestamp = 0,
  transactions = [
    {
      id: 0,
      note: '',
      cat_id: 0,
      acc_id: 0,
      amount: 0,
      transaction_type: TRANSACTION_TYPE_EXPENSE,
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
          sum -= t.amount;
          return;
        case TRANSACTION_TYPE_INCOME:
          sum += t.amount;
          return;
      }
    });

    return sum;
  };

  // TODO: temporary
  const getCategory = catID => {
    const categories = EXPENSE_CATEGORIES.concat(INCOME_CATEGORIES);

    const foundCat = categories.find(cat => cat.cat_id === catID);
    return foundCat;
  };

  // TODO: temporary
  const getAccount = accID => {
    return ACCOUNTS.find(acc => acc.acc_id === accID);
  };

  const navigateToForm = (t, cat, acc) => {
    navigation.navigate(ROUTES.transactionForm, {
      transaction: {
        timestamp: t.timestamp,
        amount: t.amount,
        note: t.note,
        cat: cat,
        account: acc,
        transaction_type: t.transaction_type,
      },
      isEdit: true,
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
          <BaseText h2 style={styles.titleItemText}>
            {`${ts.getDay()}`.padStart(2, '0')}
          </BaseText>
          <Chip
            radius={5}
            size="sm"
            containerStyle={styles.chip}
            titleStyle={styles.chipText}>
            {DAYS[ts.getDay()]}
          </Chip>
        </View>
        <AmountText showSymbol style={styles.sumText}>
          {computeAmountSum()}
        </AmountText>
      </View>
      {transactions.map((t, i) => {
        const cat = getCategory(t.cat_id);
        const acc = getAccount(t.acc_id);
        return (
          <TouchableOpacity key={i} onPress={() => navigateToForm(t, cat, acc)}>
            <ListItem containerStyle={styles.listItem}>
              <ListItem.Content style={styles.listItemContent}>
                <BaseText
                  h5
                  style={styles.category}
                  numberOfLines={1}
                  ellipsizeMode="tail">
                  {cat.cat_name}
                </BaseText>
                <View style={styles.noteAccountWrapper}>
                  <BaseText
                    h4
                    style={styles.note}
                    numberOfLines={1}
                    ellipsizeMode="tail">
                    {t.note}
                  </BaseText>
                  <BaseText h5 numberOfLines={1} ellipsizeMode="tail">
                    {acc.acc_name}
                  </BaseText>
                </View>
                <AmountText
                  h4
                  style={styles.amount}
                  numberOfLines={1}
                  ellipsizeMode="tail">
                  {renderTransactionAmount(t.amount, t.transaction_type)}
                </AmountText>
              </ListItem.Content>
            </ListItem>
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
      marginBottom: 28,
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: theme.spacing.md,
    },
    titleItem: {
      flex: 2,
      flexDirection: 'row',
      alignItems: 'center',
    },
    titleItemText: {
      fontWeight: 'bold',
    },
    chip: {
      marginLeft: 10,
    },
    chipText: {
      fontSize: 10,
      fontWeight: 'bold',
    },
    sumText: {
      flex: 1,
      textAlign: 'right',
      fontFamily: theme.fontStyles.h4.fontFamily,
      fontSize: theme.fontStyles.h4.fontSize,
    },
    listItem: {
      paddingHorizontal: 0,
      paddingTop: 20,
      paddingBottom: 14,
      borderBottomColor: theme.colors.color6,
      borderBottomWidth: 0.5,
    },
    listItemContent: {
      flexDirection: 'row',
      alignItems: 'flex-start',
    },
    category: {
      flex: 1,
    },
    noteAccountWrapper: {
      flex: 2,
      marginHorizontal: 10,
    },
    note: {
      marginBottom: 2,
    },
    amount: {
      flex: 1,
      textAlign: 'right',
      color: theme.colors.color4,
      fontFamily: theme.fontStyles.h4.fontFamily,
      fontSize: theme.fontStyles.h4.fontSize,
    },
  });
