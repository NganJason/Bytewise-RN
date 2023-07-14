import { useState, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { useTheme, Dialog } from '@rneui/themed';
import { Calendar } from 'react-native-calendars';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useNavigation } from '@react-navigation/native';

import {
  BaseInput,
  BaseCurrencyInput,
  BaseButton,
  BaseBottomSheet,
  TouchInput,
  BaseLoadableView,
} from '../../Components';

import {
  ACCOUNT_TYPE_INVESTMENT,
  TRANSACTION_TYPE_EXPENSE,
} from '../../_shared/apis/enum';

import ROUTES from '../../_shared/constant/routes';
import { EmptyContentConfig } from '../../_shared/constant/constant';
import { useGetCategories, useGetAccounts } from '../../_shared/query';
import {
  useCreateTransaction,
  useUpdateTransaction,
} from '../../_shared/mutations';
import { validateTransaction } from '../../_shared/validator/transaction';
import { renderCalendarTs, getDateStringFromTs } from '../../_shared/util/date';
import { EmptyContent } from '../../Components/Common';
import { useGetTransactionHook } from '../../_shared/hooks/transaction';
import { useValidation } from '../../_shared/hooks/validation';

const AMOUNT_SCROLL_HEIGHT = 0;
const NOTE_SCROLL_HEIGHT = 300;

const ExpenseIncomeForm = ({
  transactionID = '',
  transactionType = TRANSACTION_TYPE_EXPENSE,
  onTransactionTypeChange = function () {},
}) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const navigation = useNavigation();

  const [formErrors, setFormErrors] = useState({});
  const { validate, showValidation } = useValidation();

  const [scrollHeight, setScrollHeight] = useState(AMOUNT_SCROLL_HEIGHT);
  const [transactionForm, setTransactionForm] = useState({
    transaction_id: '',
    transaction_type: transactionType,
    transaction_time: new Date().valueOf(),
    amount: 0,
    note: '',
    category: {
      category_id: '',
      category_name: '',
    },
    account: {
      account_id: '',
      account_name: '',
    },
  });

  const isAddTransaction = () => {
    return transactionForm.transaction_id === '';
  };

  const getTransaction = useGetTransactionHook(
    { transaction_id: transactionID },
    { enabled: transactionID !== '' },
  );
  const { transaction } = getTransaction;

  const getCategories = useGetCategories({
    category_type: transactionType,
  });

  const getAccounts = useGetAccounts({});

  const createTransaction = useCreateTransaction({
    onSuccess: navigation.goBack,
  });

  const updateTransaction = useUpdateTransaction({
    onSuccess: navigation.goBack,
  });

  useEffect(() => {
    if (transaction) {
      setTransactionForm({
        ...transaction,
        amount: String(Math.abs(transaction.amount)),
      });
    }

    let { transaction_type = transactionType } = transaction || {};
    if (transaction_type !== transactionType) {
      onTransactionTypeChange(transaction_type);
    }
  }, [transaction]);

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
    setTransactionForm({
      ...transactionForm,
      category: {
        category_id: e.category_id,
        category_name: e.category_name,
      },
    });
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
    setTransactionForm({
      ...transactionForm,
      account: {
        account_id: e.account_id,
        account_name: e.account_name,
      },
    });
    toggleAccountModal();
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
    accounts.filter(d => d.account_type !== ACCOUNT_TYPE_INVESTMENT);
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

  return (
    <BaseLoadableView isLoading={isFormLoading()}>
      <KeyboardAwareScrollView
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

        <BaseInput
          label="Note"
          value={transactionForm.note}
          onChangeText={onNoteChange}
          clearButtonMode="always"
          onFocus={() => setScrollHeight(NOTE_SCROLL_HEIGHT)}
          maxLength={120}
          errorMessage={showValidation && formErrors.note}
        />

        <BaseCurrencyInput
          label="Amount"
          value={transactionForm.amount}
          onChangeText={onAmountChange}
          autoFocus={isAddTransaction()}
          onFocus={() => setScrollHeight(AMOUNT_SCROLL_HEIGHT)}
          errorMessage={showValidation && formErrors.amount}
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
          items={getCategories.data?.categories}
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
              onRedirect={toggleCategoryModal}
            />
          )}
        />

        <TouchInput
          label="Account"
          value={transactionForm.account.account_name}
          onPress={toggleAccountModal}
          disabled={!isAddTransaction()}
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

        <BaseButton
          title="Save"
          size="lg"
          width={200}
          onPress={onFormSubmit}
          loading={isFormButtonLoading()}
        />
      </KeyboardAwareScrollView>
    </BaseLoadableView>
  );
};

export default ExpenseIncomeForm;

const getStyles = _ => StyleSheet.create({});
