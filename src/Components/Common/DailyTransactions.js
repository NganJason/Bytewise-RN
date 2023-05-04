import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme, Chip } from '@rneui/themed';
import { useNavigation } from '@react-navigation/native';

import BaseText from '../Text/BaseText';
import AmountText from '../Text/AmountText';
import BaseListItem from '../View/BaseListItem';

import {
  TRANSACTION_TYPE_EXPENSE,
  TRANSACTION_TYPE_INCOME,
} from '../../_shared/api/apis/1_enum';

import { CATEGORIES } from '../../_shared/api/mock_data/category';
import { ACCOUNTS } from '../../_shared/api/mock_data/account';
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
    const foundCat = CATEGORIES.find(cat => cat.cat_id === catID);
    return foundCat;
  };

  // TODO: temporary
  const getAccount = accID => {
    return ACCOUNTS.find(acc => acc.acc_id === accID);
  };

  const navigateToForm = (t, cat, acc) => {
    navigation.navigate(ROUTES.transactionForm, {
      transaction: {
        id: t.id,
        timestamp: t.timestamp,
        amount: t.amount,
        note: t.note,
        cat: cat,
        account: acc,
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
        <AmountText showColor style={styles.sumText}>
          {computeAmountSum()}
        </AmountText>
      </View>
      {transactions.map((t, i) => {
        const cat = getCategory(t.cat_id);
        const acc = getAccount(t.acc_id);
        return (
          <TouchableOpacity key={i} onPress={() => navigateToForm(t, cat, acc)}>
            <BaseListItem
              containerStyle={styles.listItem}
              showDivider
              dividerMargin={4}>
              <View style={styles.listItemContent}>
                <BaseText
                  h6
                  style={styles.category}
                  numberOfLines={1}
                  ellipsizeMode="tail">
                  {cat.cat_name}
                </BaseText>
                <View style={styles.noteAccountWrapper}>
                  <BaseText
                    h5
                    style={styles.note}
                    numberOfLines={1}
                    ellipsizeMode="tail">
                    {t.note}
                  </BaseText>
                  <BaseText
                    h6
                    style={styles.account}
                    numberOfLines={1}
                    ellipsizeMode="tail">
                    {acc.acc_name}
                  </BaseText>
                </View>
                <AmountText
                  h5
                  style={styles.amount}
                  numberOfLines={1}
                  showColor
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
      marginBottom: 18,
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
    },
    listItemContent: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    category: {
      flex: 1,
      color: theme.colors.color5,
    },
    account: {
      color: theme.colors.color5,
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
      fontFamily: theme.fontStyles.h4.fontFamily,
      fontSize: theme.fontStyles.h4.fontSize,
    },
  });
