import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { ListItem, useTheme, Chip } from '@rneui/themed';
import { useNavigation } from '@react-navigation/native';

import BaseText from './BaseText';
import AmountText from './AmountText';

import {
  TRANSACTION_TYPE_EXPENSE,
  TRANSACTION_TYPE_INCOME,
} from '../_shared/api/data/model';

import {
  EXPENSE_CATEGORIES,
  INCOME_CATEGORIES,
} from '../_shared/api/data/mock/category';

import ROUTES from '../_shared/constant/routes';

import { DAYS } from '../_shared/constant/constant';

const DailyTransactions = ({
  timestamp = 0,
  transactions = [
    {
      id: 0,
      note: '',
      cat_id: 0,
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

  const navigateToForm = (t, cat) => {
    navigation.navigate(ROUTES.transactionForm, {
      transaction: {
        timestamp: t.timestamp,
        amount: t.amount,
        note: t.note,
        cat: cat,
        transaction_type: t.transaction_type,
      },
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
        return (
          <TouchableOpacity key={i} onPress={() => navigateToForm(t, cat)}>
            <ListItem bottomDivider containerStyle={styles.listItem}>
              <ListItem.Content style={styles.listItemContent}>
                <BaseText
                  style={styles.category}
                  numberOfLines={1}
                  ellipsizeMode="tail">
                  {cat.cat_name}
                </BaseText>
                <BaseText
                  style={styles.note}
                  numberOfLines={1}
                  ellipsizeMode="tail">
                  {t.note}
                </BaseText>
                <AmountText
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

const getStyles = _ =>
  StyleSheet.create({
    body: {
      marginBottom: 28,
    },
    row: {
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
      marginLeft: 10,
    },
    chipText: {
      fontSize: 10,
      fontWeight: 'bold',
    },
    sumText: {
      fontSize: 18,
    },
    listItem: {
      paddingHorizontal: 0,
      marginBottom: 6,
    },
    listItemContent: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    category: {
      flex: 1,
      fontSize: 14,
    },
    note: {
      flex: 2,
      fontWeight: 'bold',
      marginHorizontal: 10,
    },
    amount: {
      flex: 1,
      textAlign: 'right',
    },
  });
