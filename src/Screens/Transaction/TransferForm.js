import { useContext, useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Icon, useTheme } from '@rneui/themed';
import { useNavigation } from '@react-navigation/native';

import {
  BaseBottomSheet,
  BaseButton,
  BaseMonetaryInput,
  BaseKeyboardAwareScrollView,
  BaseLoadableView,
  EmptyContent,
  TouchInput,
} from '../../Components';
import ROUTES from '../../_shared/constant/routes';
import { EmptyContentConfig } from '../../_shared/constant/constant';
import { useGetTransaction } from '../../_shared/query';
import { useValidation } from '../../_shared/hooks';
import { validateTransfer } from '../../_shared/validator';
import { UserMetaContext } from '../../_shared/context/UserMetaContext';

const mockAccounts = [
  {
    account_id: '1',
    account_name: 'OCBC',
  },
  {
    account_id: '2',
    account_name: 'DBS',
  },
  {
    account_id: '3',
    account_name: 'Credit Card',
  },
];

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

  const [isAccountModalVisible, setIsAccountModalVisible] = useState(false);
  const toggleAccountModal = () => {
    setIsAccountModalVisible(!isAccountModalVisible);
  };

  const getTransaction = useGetTransaction(
    { transaction_id: transactionID },
    { enabled: transactionID !== '' },
  );

  useEffect(() => {
    if (getTransaction.data) {
      setTransactionForm(getTransaction.data.transaction);
    }
  }, [getTransaction.data]);

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

    navigation.goBack();
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
          items={mockAccounts}
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
