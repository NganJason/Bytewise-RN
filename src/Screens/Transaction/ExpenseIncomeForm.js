import { useState, useEffect, useContext } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTheme, Dialog } from '@rneui/themed';
import { Calendar } from 'react-native-calendars';
import { useNavigation } from '@react-navigation/native';

import {
  BaseInput,
  BaseMonetaryInput,
  BaseButton,
  BaseBottomSheet,
  TouchInput,
  BaseLoadableView,
  BaseKeyboardAwareScrollView,
} from '../../Components';

import {
  ACCOUNT_TYPE_INVESTMENT,
  ACCOUNT_TYPE_LOAN,
  TRANSACTION_TYPE_EXPENSE,
} from '../../_shared/apis/enum';

import ROUTES from '../../_shared/constant/routes';
import { EmptyContentConfig } from '../../_shared/constant/constant';
import {
  useGetCategories,
  useGetAccounts,
  useGetTransaction,
} from '../../_shared/query';
import {
  useCreateTransaction,
  useUpdateTransaction,
} from '../../_shared/mutations';
import { validateTransaction } from '../../_shared/validator';
import {
  renderCalendarTs,
  getDateStringFromTs,
  DEFAULT_CURRENCY,
} from '../../_shared/util';
import { EmptyContent } from '../../Components/Common';
import { useError, useValidation } from '../../_shared/hooks';
import { useDeleteTransaction } from '../../_shared/mutations';
import { UserMetaContext } from '../../_shared/context/UserMetaContext';

const AMOUNT_SCROLL_HEIGHT = 0;
const NOTE_SCROLL_HEIGHT = 300;

const ExpenseIncomeForm = ({
  transactionID = '',
  account = {
    account_id: '',
    account_name: '',
  },
  category = {
    category_id: '',
    category_name: '',
  },
  transactionType = TRANSACTION_TYPE_EXPENSE,
  transactionTime = new Date().valueOf(),
  onTransactionTypeChange = function () {},
}) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const navigation = useNavigation();
  const {
    updateLastTransactionCurrency,
    updateLastTransactionCategory,
    updateLastTransactionAccount,
    getLastTransactionCurrency,
    getLastTransactionCategory,
    getLastTransactionAccount,
  } = useContext(UserMetaContext);

  const [formErrors, setFormErrors] = useState({});
  const { validate, showValidation } = useValidation();

  const getInitialCategory = () => {
    let lastCategory = getLastTransactionCategory();
    if (category.category_id === '' && account.account_id === '') {
      return { ...lastCategory, category_type: transactionType };
    }
    return {
      category_id: category.category_id,
      category_name: category.category_name,
      category_type: transactionType,
    };
  };

  const getInitialAccount = () => {
    let lastAccount = getLastTransactionAccount();
    if (category.category_id === '' && account.account_id === '') {
      return lastAccount;
    }
    return {
      account_id: account.account_id,
      account_name: account.account_name,
    };
  };

  const [scrollHeight, setScrollHeight] = useState(AMOUNT_SCROLL_HEIGHT);
  const [transactionForm, setTransactionForm] = useState({
    transaction_id: '',
    transaction_type: transactionType,
    transaction_time: transactionTime,
    amount: 0,
    currency: getLastTransactionCurrency(),
    note: '',
    category: getInitialCategory(),
    account: getInitialAccount(),
  });

  const isAddTransaction = () => {
    return transactionForm.transaction_id === '';
  };

  const getTransaction = useGetTransaction(
    { transaction_id: transactionID },
    { enabled: transactionID !== '' },
  );
  const { transaction } = getTransaction?.data || {};

  const getCategories = useGetCategories({
    category_type: transactionType,
  });
  const { categories } = getCategories?.data || {};

  const getAccounts = useGetAccounts({});

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

  useEffect(() => {
    if (transaction) {
      setTransactionForm({
        ...transaction,
        amount: String(Math.abs(transaction.amount).toFixed(2)),
        category: {
          category_id: transaction?.category?.category_id || '',
          category_name: transaction?.category?.category_name || '',
          category_type:
            transaction.transaction_type || TRANSACTION_TYPE_EXPENSE,
        },
        account: {
          account_id: transaction?.account?.account_id || '',
          account_name: transaction?.account?.account_name || '',
        },
      });
    }

    let { transaction_type = transactionType } = transaction || {};
    if (transaction_type !== transactionType) {
      onTransactionTypeChange(transaction_type);
    }
  }, [transaction]);

  useEffect(() => {
    if (transactionForm.category.category_type !== transactionType) {
      setTransactionForm({
        ...transactionForm,
        category: {
          category_id: '',
          category_name: '',
        },
      });
      updateLastTransactionCategory({ category_id: '', category_name: '' });
    }
  }, [transactionType]);

  const [isCalendarModalVisible, setIsCalendarModalVisible] = useState(false);
  const toggleCalendarModal = () => {
    setIsCalendarModalVisible(!isCalendarModalVisible);
  };

  const [isCategoryModalVisible, setIsCategoryModalVisible] = useState(false);
  const toggleCategoryModal = () => {
    setIsCategoryModalVisible(!isCategoryModalVisible);
  };

  const [isAccountModalVisible, setIsAccountModalVisible] = useState(false);
  const toggleAccountModal = () => {
    setIsAccountModalVisible(!isAccountModalVisible);
  };

  const onNoteChange = e => {
    setTransactionForm({ ...transactionForm, note: e });
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

  const onCategoryChange = e => {
    let c = {
      category_id: e.category_id,
      category_name: e.category_name,
      category_type: e.category_type,
    };
    setTransactionForm({
      ...transactionForm,
      category: c,
    });
    updateLastTransactionCategory(c);
    toggleCategoryModal();
  };

  const onEditCategory = () => {
    navigation.navigate(ROUTES.categoryEdit, {
      category_type: transactionType,
    });
    toggleCategoryModal();
  };

  const onAddAccount = () => {
    navigation.navigate(ROUTES.accountSelection);
    toggleAccountModal();
  };

  const onAccountChange = e => {
    let acc = {
      account_id: e.account_id,
      account_name: e.account_name,
    };
    setTransactionForm({
      ...transactionForm,
      account: acc,
    });
    updateLastTransactionAccount(acc);
    toggleAccountModal();
  };

  const onCurrencyChange = e => {
    setTransactionForm({
      ...transactionForm,
      currency: e.code,
    });
    updateLastTransactionCurrency(e.code || DEFAULT_CURRENCY);
  };

  const onFormSubmit = () => {
    validate();

    let isValidationPass = Object.keys(formErrors).length === 0;
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
      transaction_type: transactionType,
      amount: String(transactionForm.amount),
      category_id: transactionForm.category.category_id,
      account_id: transactionForm.account.account_id,
    });
  };

  const onDelete = () => {
    deleteTransaction.mutate({
      transaction_id: transactionForm.transaction_id,
    });
  };

  const isFormLoading = () => {
    return (
      getTransaction.isLoading ||
      getCategories.isLoading ||
      getAccounts.isLoading
    );
  };

  const isFormButtonLoading = () => {
    return createTransaction.isLoading || updateTransaction.isLoading;
  };

  const getAccountOptions = () => {
    let { accounts = [] } = getAccounts?.data || {};
    accounts = accounts.filter(
      d =>
        d.account_type !== ACCOUNT_TYPE_INVESTMENT &&
        d.account_type !== ACCOUNT_TYPE_LOAN,
    );
    return accounts;
  };

  useEffect(() => {
    setFormErrors(
      validateTransaction({
        ...transactionForm,
        category_id: transactionForm.category.category_id,
        account_id: transactionForm.account.account_id,
      }),
    );
  }, [transactionForm]);

  useError([
    getTransaction,
    getAccounts,
    getCategories,
    createTransaction,
    updateTransaction,
    deleteTransaction,
  ]);

  return (
    <BaseLoadableView isLoading={isFormLoading()} scrollable={true}>
      <BaseKeyboardAwareScrollView
        keyboardShouldPersistTaps="always"
        extraHeight={scrollHeight}
        enableOnAndroid={true}
        keyboardOpeningTime={0}
        showsVerticalScrollIndicator={false}>
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
            initialDate={getDateStringFromTs(transactionForm.transaction_time)}
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
          onFocus={() => setScrollHeight(AMOUNT_SCROLL_HEIGHT)}
          errorMessage={showValidation && formErrors.amount}
          autoFocus
          allowSelectCurrency
        />

        <BaseInput
          label="Note"
          value={transactionForm.note}
          onChangeText={onNoteChange}
          clearButtonMode="always"
          onFocus={() => setScrollHeight(NOTE_SCROLL_HEIGHT)}
          maxLength={120}
          errorMessage={showValidation && formErrors.note}
        />

        <TouchInput
          label="Category"
          value={transactionForm.category.category_name}
          onPress={toggleCategoryModal}
          errorMessage={showValidation && formErrors.category}
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
          renderEmptyItems={() => (
            <EmptyContent
              item={EmptyContentConfig.category}
              route={ROUTES.categoryForm}
              routeParam={{ category_type: transactionType }}
              onRedirect={toggleCategoryModal}
            />
          )}
        />

        <TouchInput
          label="Account"
          value={transactionForm.account.account_name}
          onPress={toggleAccountModal}
          errorMessage={showValidation && formErrors.account}
        />
        <BaseBottomSheet
          isVisible={isAccountModalVisible}
          onBackdropPress={toggleAccountModal}
          close={toggleAccountModal}
          onSelect={onAccountChange}
          items={getAccountOptions()}
          label="account_name"
          headerProps={{
            leftComponent: (
              <BaseButton
                title="Add"
                type="clear"
                align="flex-end"
                size="md"
                onPress={onAddAccount}
              />
            ),
          }}
          renderEmptyItems={() => (
            <EmptyContent
              item={EmptyContentConfig.account}
              route={ROUTES.accountSelection}
              onRedirect={toggleAccountModal}
            />
          )}
        />

        {!isAddTransaction() && (
          <View style={styles.btnContainer}>
            <BaseButton
              title="Delete"
              size="lg"
              type="outline"
              width={200}
              onPress={onDelete}
              loading={deleteTransaction.isLoading}
            />
          </View>
        )}
        <BaseButton
          title="Save"
          size="lg"
          width={200}
          onPress={onFormSubmit}
          loading={isFormButtonLoading()}
        />
      </BaseKeyboardAwareScrollView>
    </BaseLoadableView>
  );
};

export default ExpenseIncomeForm;

const getStyles = _ =>
  StyleSheet.create({
    btnContainer: {
      marginBottom: 16,
    },
  });
