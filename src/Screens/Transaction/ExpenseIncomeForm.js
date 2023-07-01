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

import { TRANSACTION_TYPE_EXPENSE } from '../../_shared/apis/enum';

import ROUTES from '../../_shared/constant/routes';
import { DAYS, EmptyContentConfig } from '../../_shared/constant/constant';
import { useGetCategories, useGetAccounts } from '../../_shared/query';
import {
  useCreateTransaction,
  useUpdateTransaction,
} from '../../_shared/mutations';
import { validateTransaction } from '../../_shared/apis/transaction';
import { getYear, getMonth, getDate, getDay } from '../../_shared/util/date';
import { EmptyContent } from '../../Components/Common';
import { useGetTransactionHook } from '../../_shared/hooks/transaction';

const AMOUNT_SCROLL_HEIGHT = 0;
const NOTE_SCROLL_HEIGHT = 300;

const ExpenseIncomeForm = ({
  transactionID = '',
  transactionType = TRANSACTION_TYPE_EXPENSE,
}) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const navigation = useNavigation();

  const [scrollHeight, setScrollHeight] = useState(AMOUNT_SCROLL_HEIGHT);
  const [transactionForm, setTransactionForm] = useState({
    transaction_id: '',
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

  const isValidTransaction = () => {
    try {
      validateTransaction({
        ...transactionForm,
        category_id: transactionForm.category.category_id,
      });
      return true;
    } catch {
      return false;
    }
  };

  const formatTimestampForCalendar = ts => {
    const date = new Date(ts);
    const year = `${getYear(date)}`;
    const month = `${getMonth(date)}`.padStart(2, '0');
    const day = `${getDate(date)}`.padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const renderTimestamp = ts => {
    const d = new Date(ts);

    const yyyy = getYear(d);
    const mm = getMonth(d);
    const date = getDate(d);
    const day = DAYS[getDay(d)];

    return `${date}/${mm}/${yyyy} (${day})`;
  };

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
          value={renderTimestamp(transactionForm.transaction_time)}
          onPress={toggleCalendarModal}
        />
        <Dialog
          isVisible={isCalendarModalVisible}
          onBackdropPress={toggleCalendarModal}>
          <Calendar
            showSixWeeks
            initialDate={formatTimestampForCalendar(
              transactionForm.transaction_time,
            )}
            hideExtraDays={false}
            onDayPress={obj => {
              onTransactionTimeChange(
                new Date(obj.timestamp).setHours(0, 0, 0, 0),
              );
            }}
            markedDates={{
              [formatTimestampForCalendar(transactionForm.transaction_time)]: {
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
        />

        <BaseCurrencyInput
          label="Amount"
          value={transactionForm.amount}
          onChangeText={onAmountChange}
          autoFocus={isAddTransaction()}
          onFocus={() => setScrollHeight(AMOUNT_SCROLL_HEIGHT)}
        />

        <TouchInput
          label="Category"
          value={transactionForm.category.category_name}
          onPress={toggleCategoryModal}
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
        />
        <BaseBottomSheet
          isVisible={isAccountModalVisible}
          onBackdropPress={toggleAccountModal}
          close={toggleAccountModal}
          onSelect={onAccountChange}
          items={getAccounts.data?.accounts || []}
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
          //   disabled={!isValidTransaction()}
          onPress={onFormSubmit}
          loading={isFormButtonLoading()}
        />
      </KeyboardAwareScrollView>
    </BaseLoadableView>
  );
};

export default ExpenseIncomeForm;

const getStyles = _ => StyleSheet.create({});
