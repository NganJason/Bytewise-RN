import { useState, useEffect, useContext, useRef } from 'react';
import { StyleSheet, Animated } from 'react-native';
import { useTheme, Dialog } from '@rneui/themed';
import { Calendar } from 'react-native-calendars';
import { useNavigation } from '@react-navigation/native';
import {
  BaseScreenV2,
  BaseText,
  BaseScrollableTab,
  TouchInput,
  BaseInput,
  BaseMonetaryInput,
  DeleteSaveButton,
  BaseBottomSheet,
  BaseButton,
  EmptyContent,
  IconButton,
} from '../../Components';
import {
  ACCOUNT_TYPE_INVESTMENT,
  ACCOUNT_TYPE_LOAN,
  TRANSACTION_TYPE_EXPENSE,
  TRANSACTION_TYPE_INCOME,
  TRANSACTION_TYPE_TRANSFER,
} from '../../_shared/apis/enum';
import { validateTransaction } from '../../_shared/validator';
import { renderCalendarTs, getDateStringFromTs } from '../../_shared/util';
import {
  useGetTransaction,
  useGetAccount,
  useGetAccounts,
  useGetCategory,
  useGetCategories,
} from '../../_shared/query';
import { useError } from '../../_shared/hooks';
import { UserMetaContext } from '../../_shared/context/UserMetaContext';
import {
  useCreateTransaction,
  useUpdateTransaction,
  useDeleteTransaction,
} from '../../_shared/mutations';
import ROUTES from '../../_shared/constant/routes';

const ACCOUNT_INPUT = 'account';
const TO_ACCOUNT_INPUT = 'to_account';
const FROM_ACCOUNT_INPUT = 'from_account';

const TRANSACTION_TYPES = [
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
  {
    name: 'Transfer',
    val: TRANSACTION_TYPE_TRANSFER,
    iconName: 'repeat',
    iconType: 'feather',
  },
];

const TransactionFormV2 = ({ route }) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const navigation = useNavigation();
  const { getUserBaseCurrency } = useContext(UserMetaContext);

  const spinValue = useRef(new Animated.Value(0)).current;

  const spinDeg = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const spinArrow = () => {
    spinValue.setValue(0);
    Animated.spring(spinValue, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const {
    transactionID = '',
    accountID = '',
    categoryID = '',
    transactionTime = new Date().valueOf(),
  } = route?.params || {};

  const [activeTabIdx, setActiveTabIdx] = useState(
    transactionID === '' ? 0 : null,
  );

  const [transactionForm, setTransactionForm] = useState({
    transaction_id: transactionID,
    transaction_type: TRANSACTION_TYPES[activeTabIdx]?.val,
    transaction_time: transactionTime,
    amount: '',
    currency: getUserBaseCurrency(),
    note: '',
    category: null,
    account: null,
    from_account: null,
    to_account: null,
  });

  const [categories, setCategories] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [activeAccountInput, setActiveAccountInput] = useState('');

  const [isFormReady, setIsFormReady] = useState(
    transactionForm.transaction_id === '',
  );

  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    setFormErrors(
      validateTransaction({
        ...transactionForm,
        category_id: transactionForm.category?.category_id,
        account_id: transactionForm.account?.account_id,
        from_account_id: transactionForm.from_account?.account_id,
        to_account_id: transactionForm.to_account?.account_id,
      }),
    );
  }, [transactionForm]);

  const getTransaction = useGetTransaction(
    { transaction_id: transactionID },
    {
      enabled: transactionID !== '',
      onSuccess: data => {
        setActiveTabIdx(data?.transaction.transaction_type - 1);
        setTransactionForm({
          ...data?.transaction,
          amount: String(Math.abs(data?.transaction?.amount).toFixed(2)),
        });
        setIsFormReady(true);
      },
      onError: _ => {
        setIsFormReady(true);
      },
    },
  );

  const getCategory = useGetCategory(
    {
      category_id: categoryID,
    },
    {
      enabled: categoryID !== '',
      onSuccess: data => {
        setTransactionForm({ ...transactionForm, category: data?.category });
      },
    },
  );

  const getCategories = useGetCategories(
    {
      category_type: transactionForm.transaction_type,
    },
    {
      enabled: transactionForm.transaction_type !== TRANSACTION_TYPE_TRANSFER,
      onSuccess: data => {
        setCategories(data?.categories);
      },
    },
  );

  const getAccount = useGetAccount(
    { account_id: accountID },
    {
      enabled: accountID !== '',
      onSuccess: data => {
        setTransactionForm({ ...transactionForm, account: data?.account });
      },
    },
  );

  const getAccounts = useGetAccounts(
    {},
    {
      onSuccess: data => {
        setAccounts(
          data?.accounts.filter(
            ac =>
              ac.account_type !== ACCOUNT_TYPE_INVESTMENT &&
              ac.account_type !== ACCOUNT_TYPE_LOAN,
          ),
        );
      },
    },
  );

  const onTransactionTypeChange = idx => {
    setTransactionForm({
      ...transactionForm,
      transaction_type: TRANSACTION_TYPES[idx].val,
      category: null,
    });
    setActiveTabIdx(idx);
  };

  const onAmountChange = e => {
    setTransactionForm({ ...transactionForm, amount: e });
  };

  const onTransactionTimeChange = e => {
    setTransactionForm({
      ...transactionForm,
      transaction_time: e,
    });
    toggleCalendarModal();
  };

  const onCurrencyChange = e => {
    setTransactionForm({
      ...transactionForm,
      currency: e.code,
    });
  };

  const onNoteChange = e => {
    setTransactionForm({ ...transactionForm, note: e });
  };

  const isAddTransaction = () => transactionID === '';

  const [isCalendarModalVisible, setIsCalendarModalVisible] = useState(false);
  const toggleCalendarModal = () => {
    setIsCalendarModalVisible(!isCalendarModalVisible);
  };

  const [isCategoryModalVisible, setIsCategoryModalVisible] = useState(false);
  const toggleCategoryModal = () => {
    setIsCategoryModalVisible(!isCategoryModalVisible);
  };

  const onCategoryChange = e => {
    setTransactionForm({ ...transactionForm, category: e });
    toggleCategoryModal();
  };

  const onEditCategory = () => {
    navigation.navigate(ROUTES.categoryEdit, {
      category_type: transactionForm.transaction_type,
    });
    toggleCategoryModal();
  };

  const [isAccountModalVisible, setIsAccountModalVisible] = useState(false);
  const toggleAccountModal = (accountInput = '') => {
    setIsAccountModalVisible(!isAccountModalVisible);
    setActiveAccountInput(accountInput);
  };

  const onAccountChange = e => {
    switch (activeAccountInput) {
      case ACCOUNT_INPUT:
        setTransactionForm({ ...transactionForm, account: e });
        break;
      case FROM_ACCOUNT_INPUT:
        setTransactionForm({ ...transactionForm, from_account: e });
        break;
      case TO_ACCOUNT_INPUT:
        setTransactionForm({ ...transactionForm, to_account: e });
        break;
    }
    toggleAccountModal();
  };

  const toAddAccount = () => {
    navigation.navigate(ROUTES.accountSelection);
    toggleAccountModal();
  };

  const onAccountSwap = () => {
    spinArrow();
    setTransactionForm({
      ...transactionForm,
      to_account: transactionForm.from_account,
      from_account: transactionForm.to_account,
    });
  };

  const createTransaction = useCreateTransaction({
    onSuccess: navigation.goBack,
  });

  const updateTransaction = useUpdateTransaction({
    onSuccess: navigation.goBack,
  });

  const deleteTransaction = useDeleteTransaction({
    onSuccess: navigation.goBack,
    meta: {
      account_id: transactionForm?.account?.account_id || '',
    },
  });

  const onSave = () => {
    const isValidationPass = Object.keys(formErrors).length === 0;
    if (!isValidationPass) {
      return;
    }

    let mutation;
    if (!isAddTransaction()) {
      mutation = updateTransaction;
    } else {
      mutation = createTransaction;
    }
    mutation.mutate({
      ...transactionForm,
      amount: String(transactionForm.amount),
      category_id: transactionForm.category?.category_id,
      account_id: transactionForm.account?.account_id,
      from_account_id: transactionForm.from_account?.account_id,
      to_account_id: transactionForm.to_account?.account_id,
    });
  };

  const onDelete = () => {
    deleteTransaction.mutate({
      transaction_id: transactionForm.transaction_id,
    });
  };

  // let get categories and get accounts load in the background
  const isFormLoading = () =>
    getTransaction.isLoading || getAccount.isLoading || getCategory.isLoading;

  const isSaveButtonLoading = () =>
    createTransaction.isLoading || updateTransaction.isLoading;

  const isDeleteButtonLoading = () => deleteTransaction.isLoading;

  const hasFormErrors = () => Object.keys(formErrors).length;

  useError([
    getTransaction,
    createTransaction,
    updateTransaction,
    deleteTransaction,
    getAccount,
    getAccounts,
    getCategory,
    getCategories,
  ]);

  return (
    <BaseScreenV2
      isLoading={isFormLoading()}
      backButtonProps={{ show: true }}
      subHeader={
        isFormReady && (
          <BaseScrollableTab
            tabs={TRANSACTION_TYPES}
            activeTabIdx={activeTabIdx}
            onTabChange={onTransactionTypeChange}
          />
        )
      }
      headerProps={{
        centerComponent: (
          <BaseText h2>
            {isAddTransaction() ? 'Add Transaction' : 'Edit Transaction'}
          </BaseText>
        ),
      }}>
      {isFormReady && (
        <>
          <TouchInput
            label="Date"
            value={renderCalendarTs(transactionForm.transaction_time)}
            onPress={toggleCalendarModal}
          />

          <Dialog
            isVisible={isCalendarModalVisible}
            onBackdropPress={toggleCalendarModal}>
            <Calendar
              showSixWeeks
              initialDate={getDateStringFromTs(
                transactionForm.transaction_time,
              )}
              hideExtraDays={false}
              onDayPress={obj => {
                onTransactionTimeChange(
                  new Date(obj.timestamp).setHours(0, 0, 0, 0),
                );
              }}
              markedDates={{
                [getDateStringFromTs(transactionForm.transaction_time)]: {
                  selected: true,
                  disableTouchEvent: true,
                  selectedColor: theme.colors.primary,
                },
              }}
              theme={{
                todayTextColor: theme.colors.primary,
                arrowColor: theme.colors.primary,
              }}
            />
          </Dialog>

          <BaseMonetaryInput
            label="Amount"
            value={transactionForm.amount}
            currency={transactionForm.currency}
            onChangeText={onAmountChange}
            onChangeCurrency={onCurrencyChange}
            autoFocus
            allowSelectCurrency
          />

          <BaseInput
            label="Note"
            value={transactionForm.note}
            onChangeText={onNoteChange}
            clearButtonMode="always"
            maxLength={120}
          />

          <>
            {transactionForm.transaction_type === TRANSACTION_TYPE_TRANSFER ? (
              <>
                <TouchInput
                  label="From"
                  value={transactionForm.from_account?.account_name}
                  onPress={() => toggleAccountModal(FROM_ACCOUNT_INPUT)}
                />

                <Animated.View style={{ transform: [{ rotate: spinDeg }] }}>
                  <IconButton
                    iconName="swap-vert"
                    iconType="material"
                    color={theme.colors.color1}
                    buttonStyle={styles.swapBtn}
                    onPress={onAccountSwap}
                  />
                </Animated.View>

                <TouchInput
                  label="To"
                  value={transactionForm.to_account?.account_name}
                  onPress={() => toggleAccountModal(TO_ACCOUNT_INPUT)}
                />
              </>
            ) : (
              <>
                <TouchInput
                  label="Category"
                  value={transactionForm.category?.category_name}
                  onPress={toggleCategoryModal}
                />
                <BaseBottomSheet
                  isVisible={isCategoryModalVisible}
                  onBackdropPress={toggleCategoryModal}
                  close={toggleCategoryModal}
                  onSelect={onCategoryChange}
                  items={categories}
                  label="category_name"
                  headerProps={{
                    leftComponent: (
                      <BaseButton
                        title="Edit"
                        type="clear"
                        align="flex-end"
                        size="md"
                        onPress={onEditCategory}
                      />
                    ),
                  }}
                  renderEmptyItems={() => <EmptyContent />}
                />

                <TouchInput
                  label="Account"
                  value={transactionForm.account?.account_name}
                  onPress={() => toggleAccountModal(ACCOUNT_INPUT)}
                />
              </>
            )}
          </>

          <BaseBottomSheet
            isVisible={isAccountModalVisible}
            onBackdropPress={toggleAccountModal}
            close={toggleAccountModal}
            onSelect={onAccountChange}
            items={accounts}
            label="account_name"
            headerProps={{
              leftComponent: (
                <BaseButton
                  title="Add"
                  type="clear"
                  align="flex-end"
                  size="md"
                  onPress={toAddAccount}
                />
              ),
            }}
            renderEmptyItems={() => <EmptyContent />}
          />

          <DeleteSaveButton
            onSave={onSave}
            onDelete={onDelete}
            isSaveLoading={isSaveButtonLoading()}
            isDeleteLoading={isDeleteButtonLoading()}
            allowDelete={!isAddTransaction()}
            disableSave={hasFormErrors()}
          />
        </>
      )}
    </BaseScreenV2>
  );
};

export default TransactionFormV2;

const getStyles = _ =>
  StyleSheet.create({
    swapBtn: {
      alignItems: 'center',
      justifyContent: 'center',
      alignSelf: 'center',
      marginBottom: 10, // allign with BaseInput
    },
  });
