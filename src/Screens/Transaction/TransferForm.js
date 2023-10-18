import { useContext, useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { Dialog, Icon, useTheme } from '@rneui/themed';
import { useNavigation } from '@react-navigation/native';

import {
  BaseBottomSheet,
  BaseButton,
  BaseMonetaryInput,
  BaseKeyboardAwareScrollView,
  BaseLoadableView,
  EmptyContent,
  TouchInput,
  DeleteSaveButton,
} from '../../Components';
import ROUTES from '../../_shared/constant/routes';
import { EmptyContentConfig } from '../../_shared/constant/constant';
import { useGetAccounts, useGetTransaction } from '../../_shared/query';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useValidation } from '../../_shared/hooks';
import { validateTransfer } from '../../_shared/validator';
import { UserMetaContext } from '../../_shared/context/UserMetaContext';
import {
  useCreateTransaction,
  useDeleteTransaction,
  useUpdateTransaction,
} from '../../_shared/mutations';
import {
  ACCOUNT_TYPE_INVESTMENT,
  TRANSACTION_TYPE_TRANSFER,
} from '../../_shared/apis/enum';
import { getDateStringFromTs, renderCalendarTs } from '../../_shared/util';
import { Calendar } from 'react-native-calendars';

const fromAccountFocus = 1;
const toAccountFocus = 2;

const TransferForm = ({ transactionID = '' }) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const navigation = useNavigation();
  const { getUserBaseCurrency } = useContext(UserMetaContext);

  const [accountFocus, setAccountFocus] = useState(fromAccountFocus);
  const [transactionForm, setTransactionForm] = useState({
    transaction_id: '',
    transaction_time: new Date().valueOf(),
    amount: 0,
    currency: getUserBaseCurrency(),
    from_account: {
      account_id: '',
      account_name: '',
    },
    to_account: {
      account_id: '',
      account_name: '',
    },
  });

  const [formErrors, setFormErrors] = useState({});
  const { validate, showValidation } = useValidation();
  useEffect(() => {
    setFormErrors(
      validateTransfer({
        ...transactionForm,
        from_account_id: transactionForm.from_account.account_id,
        to_account_id: transactionForm.to_account.account_id,
      }),
    );
  }, [transactionForm]);

  const isAddTransaction = () => {
    return transactionForm.transaction_id === '';
  };

  const [isAccountModalVisible, setIsAccountModalVisible] = useState(false);
  const toggleAccountModal = () => {
    setIsAccountModalVisible(!isAccountModalVisible);
  };

  const [isCalendarModalVisible, setIsCalendarModalVisible] = useState(false);
  const toggleCalendarModal = () => {
    setIsCalendarModalVisible(!isCalendarModalVisible);
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
      from_account_id: transactionForm?.from_account?.account_id || '',
      to_account_id: transactionForm?.to_account?.account_id || '',
    },
  });

  const getTransaction = useGetTransaction(
    { transaction_id: transactionID },
    { enabled: transactionID !== '' },
  );

  useEffect(() => {
    if (getTransaction.data) {
      setTransactionForm(getTransaction.data.transaction);
    }
  }, [getTransaction.data]);

  const getAccounts = useGetAccounts({});

  const getAccountOptions = () => {
    let { accounts = [] } = getAccounts?.data || {};
    accounts = accounts.filter(d => d.account_type !== ACCOUNT_TYPE_INVESTMENT);
    return accounts;
  };

  const onTransactionTimeChange = e => {
    setTransactionForm({
      ...transactionForm,
      transaction_time: e,
    });
    toggleCalendarModal();
  };

  const onAmountChange = e => {
    setTransactionForm({ ...transactionForm, amount: e });
  };

  const onCurrencyChange = e => {
    setTransactionForm({ ...transactionForm, currency: e.code });
  };

  const onAccountPress = focus => {
    setAccountFocus(focus);
    toggleAccountModal();
  };

  const onAccountChange = e => {
    let newForm = { ...transactionForm };
    if (accountFocus === fromAccountFocus) {
      newForm.from_account = {
        account_id: e.account_id,
        account_name: e.account_name,
      };
    } else {
      newForm.to_account = {
        account_id: e.account_id,
        account_name: e.account_name,
      };
    }

    setTransactionForm(newForm);
    toggleAccountModal();
  };

  const onAddAccount = () => {
    navigation.navigate(ROUTES.accountSelection);
    toggleAccountModal();
  };

  const onSwap = () => {
    setTransactionForm({
      ...transactionForm,
      to_account: transactionForm.from_account,
      from_account: transactionForm.to_account,
    });
  };

  const onFormSubmit = () => {
    validate();
    let isValidationPassed = Object.keys(formErrors).length === 0;
    if (!isValidationPassed) {
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
      transaction_type: TRANSACTION_TYPE_TRANSFER,
      amount: String(transactionForm.amount),
      from_account_id: transactionForm.from_account.account_id,
      to_account_id: transactionForm.to_account.account_id,
    });
  };

  const onDelete = () => {
    deleteTransaction.mutate({
      transaction_id: transactionForm.transaction_id,
    });
  };

  const isFormLoading = () => {
    return false;
  };

  const isFormButtonLoading = () => {
    return false;
  };

  return (
    <BaseLoadableView isLoading={isFormLoading()}>
      <BaseKeyboardAwareScrollView
        keyboardShouldPersistTaps="always"
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
          autoFocus={transactionForm.transaction_id === ''}
          errorMessage={showValidation && formErrors.amount}
          allowSelectCurrency
        />

        <TouchInput
          label="From"
          value={transactionForm.from_account.account_name}
          onPress={() => {
            onAccountPress(fromAccountFocus);
          }}
          errorMessage={showValidation && formErrors.from_account}
        />

        <TouchableOpacity style={styles.swapBtn} onPress={onSwap}>
          <Icon name="swap" type="antdesign" color={theme.colors.color1} />
        </TouchableOpacity>

        <TouchInput
          label="To"
          value={transactionForm.to_account.account_name}
          onPress={() => {
            onAccountPress(toAccountFocus);
          }}
          errorMessage={showValidation && formErrors.to_account}
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

        <DeleteSaveButton
          onSave={onFormSubmit}
          isSaveLoading={isFormButtonLoading()}
          onDelete={onDelete}
          isDeleteLoading={deleteTransaction.isLoading}
          allowDelete={!isAddTransaction()}
        />
      </BaseKeyboardAwareScrollView>
    </BaseLoadableView>
  );
};

export default TransferForm;

const getStyles = theme =>
  StyleSheet.create({
    swapBtn: {
      alignItems: 'center',
      justifyContent: 'center',
      alignSelf: 'center',
      marginVertical: 0,
      width: 40,
      height: 40,
      borderRadius: 100,
      transform: [{ rotate: '90deg' }],
      backgroundColor: theme.colors.white,
      shadowColor: theme.colors.black,
      shadowOffset: {
        width: 1,
        height: 0,
      },
      shadowOpacity: 0.3,
      shadowRadius: 3,
    },
  });
