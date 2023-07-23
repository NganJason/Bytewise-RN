import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '@rneui/themed';
import { useNavigation } from '@react-navigation/native';

import BaseText from '../Text/BaseText';
import AmountText from '../Text/AmountText';
import BaseListItem from '../View/BaseListItem';

import ROUTES from '../../_shared/constant/routes';
import { DAYS } from '../../_shared/constant/constant';
import { getDate, getDay } from '../../_shared/util/date';
import { BaseChip } from '../View';
import { capitalize } from '../../_shared/util/string';

const DailyTransactions = ({
  timestamp = 0,
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

  const computeAmountSum = () => {
    let sum = 0;
    transactions.forEach(t => {
      sum += Number(t.amount);
    });

    return sum;
  };

  const navigateToForm = t => {
    navigation.navigate(ROUTES.transactionForm, {
      transaction_id: t.transaction_id,
    });
  };

  const formatCategoryName = (name = '') => {
    if (name === '') {
      return '-';
    }
    return capitalize(name);
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
              dividerMargin={1}>
              <View style={styles.listItemContent}>
                <BaseText
                  text5
                  style={styles.category}
                  numberOfLines={1}
                  ellipsizeMode="tail">
                  {formatCategoryName(t.category.category_name)}
                </BaseText>
                <View style={styles.noteWrapper}>
                  <BaseText
                    text3
                    style={styles.note}
                    numberOfLines={1}
                    ellipsizeMode="tail">
                    {capitalize(t.note)}
                  </BaseText>
                  <BaseText
                    text5
                    style={styles.account}
                    numberOfLines={1}
                    ellipsizeMode="tail">
                    {t?.account?.account_name || '-'}
                  </BaseText>
                </View>
                <AmountText
                  text5
                  style={styles.amount}
                  numberOfLines={1}
                  showSymbol
                  ellipsizeMode="tail">
                  {t.amount}
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
      color: theme.colors.color7,
    },
    account: {
      color: theme.colors.color7,
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
