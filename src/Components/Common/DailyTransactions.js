import { View, StyleSheet } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useTheme } from '@rneui/themed';
import { useNavigation } from '@react-navigation/native';

import BaseText from '../Text/BaseText';
import AmountText from '../Text/AmountText';
import BaseListItem from '../View/BaseListItem';

import ROUTES from '../../_shared/constant/routes';
import { DAYS } from '../../_shared/constant/constant';
import { getDate, getDay, isTransactionTypeTransfer } from '../../_shared/util';
import { BaseChip } from '../View';
import { Amount } from '../../_shared/object';

const DailyTransactions = ({
  timestamp = 0,
  dailyTotal = new Amount(),
  transactions = [
    {
      transaction_id: '',
      category: {
        category_id: '',
        category_name: '',
      },
      account: {
        account_id: '',
        account_name: '',
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

  const navigateToForm = t => {
    navigation.navigate(ROUTES.transactionForm, {
      transactionID: t.transaction_id,
    });
  };

  const formatCategoryName = (name = '') => {
    if (name === '') {
      return '-';
    }
    return name;
  };

  const formatNote = (transaction = {}) => {
    return transaction.note !== '' ? transaction.note : '-';
  };

  const formatAccountName = (transaction = {}) => {
    if (isTransactionTypeTransfer(transaction.transaction_type)) {
      const from_account_name = transaction?.from_account?.account_name || 'NA';
      const to_account_name = transaction?.to_account?.account_name || 'NA';

      return `${from_account_name} -> ${to_account_name}`;
    }

    return transaction?.account?.account_name || '-';
  };

  return (
    <View style={styles.body}>
      <View style={styles.row}>
        <View style={styles.titleItem}>
          <BaseText text1 style={styles.titleItemText}>
            {`${getDate(ts)}`.padStart(2, '0')}
          </BaseText>
          <View style={styles.chip}>
            <BaseChip>{DAYS[getDay(ts)]}</BaseChip>
          </View>
        </View>
        <AmountText amount={dailyTotal} showColor style={styles.sumText} />
      </View>
      {transactions.map((t, i) => {
        return (
          <TouchableOpacity key={i} onPress={() => navigateToForm(t)}>
            <BaseListItem
              containerStyle={styles.listItem}
              showDivider
              dividerMargin={1}>
              <View style={styles.listItemContent}>
                <BaseText text5 style={styles.category} numberOfLines={1}>
                  {formatCategoryName(t?.category?.category_name || '')}
                </BaseText>
                <View style={styles.noteWrapper}>
                  <BaseText text5 style={styles.note} numberOfLines={1}>
                    {formatNote(t)}
                  </BaseText>
                  <BaseText text5 style={styles.account} numberOfLines={1}>
                    {formatAccountName(t)}
                  </BaseText>
                </View>
                <AmountText
                  text5
                  amount={new Amount(t.amount, t.currency)}
                  style={styles.amount}
                  numberOfLines={1}
                  showSign={!isTransactionTypeTransfer(t.transaction_type)}
                />
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
      color: theme.colors.color7,
    },
    account: {
      marginTop: 4,
      color: theme.colors.color7,
    },
    noteWrapper: {
      flex: 1,
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
    chip: {
      marginLeft: 10,
    },
  });
