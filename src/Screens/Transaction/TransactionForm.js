import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTheme } from '@rneui/themed';
import {
  TRANSACTION_TYPE_EXPENSE,
  TRANSACTION_TYPE_INCOME,
  TRANSACTION_TYPE_TRANSFER,
} from '../../_shared/apis/enum';
import { BaseScreen, BaseText, BaseScrollableTab } from '../../Components';
import ExpenseIncomeForm from './ExpenseIncomeForm';
import TransferForm from './TransferForm';

const scrollableTabs = [
  {
    name: 'Expense',
    val: TRANSACTION_TYPE_EXPENSE,
    iconName: 'shopping-bag',
    iconType: 'feather',
  },
  {
    name: 'Income',
    val: TRANSACTION_TYPE_INCOME,
    iconName: 'credit-card',
    iconType: 'feather',
  },
  // {
  //   name: 'Transfer',
  //   val: TRANSACTION_TYPE_TRANSFER,
  //   iconName: 'repeat',
  //   iconType: 'feather',
  // },
];

const TransactionForm = ({ route }) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  const {
    transaction_id: transactionID = '',
    account = { account_id: '', account_name: '' },
    category = { category_id: '', category_name: '' },
    transaction_time: transactionTime = new Date().valueOf(),
  } = route?.params || {};

  const [activeTabIdx, setActiveTabIdx] = useState(0);

  const onTransactionTypeChange = type => {
    const idx = scrollableTabs.findIndex(tab => tab.val === type);
    setActiveTabIdx(idx);
  };

  return (
    <BaseScreen
      allowLoadable={false}
      headerProps={{
        allowBack: true,
        centerComponent: <BaseText h2>Transaction</BaseText>,
      }}>
      <>
        <View style={styles.tabContainer}>
          <BaseScrollableTab
            tabs={scrollableTabs}
            activeTabIdx={activeTabIdx}
            onTabChange={setActiveTabIdx}
          />
        </View>

        <View style={styles.formBody}>
          {scrollableTabs[activeTabIdx].val === TRANSACTION_TYPE_TRANSFER ? (
            <TransferForm transactionID={transactionID} />
          ) : (
            <ExpenseIncomeForm
              transactionID={transactionID}
              account={account}
              category={category}
              transactionType={scrollableTabs[activeTabIdx].val}
              transactionTime={transactionTime}
              onTransactionTypeChange={onTransactionTypeChange}
            />
          )}
        </View>
      </>
    </BaseScreen>
  );
};

export default TransactionForm;

const getStyles = _ =>
  StyleSheet.create({
    formBody: {
      flex: 1,
      paddingVertical: 22,
    },
    tabContainer: {
      marginBottom: 10,
    },
  });
