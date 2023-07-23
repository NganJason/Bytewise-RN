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
  } = route?.params || {};
  const isAddTransaction = () => {
    return transactionID === '';
  };

  const [activeTab, setActiveTab] = useState(scrollableTabs[0]);

  const onTabChange = tab => {
    setActiveTab(tab);
  };

  const onTransactionTypeChange = type => {
    const targetTab = scrollableTabs.find(tab => tab.val === type);
    if (targetTab !== undefined) {
      setActiveTab(targetTab);
    }
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
            activeTab={activeTab}
            onTabChange={onTabChange}
            disableNonActive={!isAddTransaction()}
          />
        </View>

        <View style={styles.formBody}>
          {activeTab.val === TRANSACTION_TYPE_TRANSFER ? (
            <TransferForm transactionID={transactionID} />
          ) : (
            <ExpenseIncomeForm
              transactionID={transactionID}
              account={account}
              transactionType={activeTab.val}
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
      minHeight: '100%',
      paddingVertical: 22,
    },
    tabContainer: {
      marginBottom: 10,
    },
  });
