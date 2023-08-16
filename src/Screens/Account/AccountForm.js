import { useEffect, useState } from 'react';
import { CommonActions, useNavigation } from '@react-navigation/native';
import { useTheme } from '@rneui/themed';
import { StyleSheet, View } from 'react-native';
import {
  BaseBottomSheet,
  BaseButton,
  BaseCheckbox,
  BaseCurrencyInput,
  BaseInput,
  BaseScreen,
  BaseText,
  TouchInput,
} from '../../Components';
import {
  ACCOUNT_TYPES,
  ACCOUNT_TYPE_BANK_ACCOUNT,
  ACCOUNT_TYPE_INVESTMENT,
  ACCOUNT_TYPE_LOAN,
  ACCOUNT_UPDATE_MODE_DEFAULT,
  ACCOUNT_UPDATE_MODE_OFFSET_TRANSACTION,
} from '../../_shared/apis/enum';
import { getAccountTypes } from '../../_shared/util/budget';
import { useGetAccount } from '../../_shared/query/account';
import { useCreateAccount, useUpdateAccount } from '../../_shared/mutations';
import {
  BaseKeyboardAwareScrollView,
  BaseOverlay,
} from '../../Components/View';
import { useValidation } from '../../_shared/hooks/validation';
import { validateAccount } from '../../_shared/validator/account';
import ROUTES from '../../_shared/constant/routes';
import { useError } from '../../_shared/hooks/error';
import {
  isAccountTypeAsset,
  isAccountTypeDebt,
} from '../../_shared/util/account';

const AccountForm = ({ route }) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const navigation = useNavigation();

  const {
    account_id: accountID = '',
    account_type: accountType = ACCOUNT_TYPE_BANK_ACCOUNT,
  } = route?.params || {};
  const isAddAccount = () => {
    return accountID === '';
  };

  const [accountForm, setAccountForm] = useState({
    account_id: accountID,
    account_name: '',
    account_type: accountType,
    balance: 0,
    update_mode: ACCOUNT_UPDATE_MODE_DEFAULT,
  });

  const [formErrors, setFormErrors] = useState({});
  const { validate, showValidation } = useValidation();
  useEffect(() => {
    setFormErrors(validateAccount(accountForm));
  }, [accountForm]);

  const getAccount = useGetAccount(
    { account_id: accountID },
    { enabled: accountID !== '' },
  );

  const createAccount = useCreateAccount({
    onSuccess: resp => {
      const { account_id: newAccountID = '' } = resp?.account || [];

      if (
        accountForm.account_type === ACCOUNT_TYPE_INVESTMENT &&
        newAccountID !== ''
      ) {
        const navigationStack = navigation.getState().routes;
        // Pop accountForm and accountSelection screen
        navigationStack.pop();
        navigationStack.pop();

        navigation.dispatch(
          CommonActions.reset({
            index: navigationStack.length,
            routes: [
              ...navigationStack,
              {
                name: ROUTES.investmentBreakdown,
                params: { account_id: newAccountID },
              },
            ],
          }),
        );
      } else {
        // Go back twice for creation flow
        // To skip account selection page
        navigation.goBack();
        navigation.goBack();
      }
    },
  });

  const updateAccount = useUpdateAccount({
    onSuccess: () => {
      navigation.goBack();
    },
  });

  useEffect(() => {
    const { account } = getAccount?.data || {};
    if (account !== undefined) {
      setAccountForm({
        ...account,
        balance: Number(account.balance),
        update_mode: ACCOUNT_UPDATE_MODE_DEFAULT,
      });
    }
  }, [getAccount.data]);

  const [accountTypeModalVisible, setAccountTypeModalVisible] = useState(false);
  const toggleAccountTypeModal = () => {
    setAccountTypeModalVisible(!accountTypeModalVisible);
  };

  const onAccountNameChange = e => {
    setAccountForm({ ...accountForm, account_name: e });
  };

  const onAccountTypeChange = e => {
    setAccountForm({ ...accountForm, account_type: e.value });
    toggleAccountTypeModal();
  };

  const onBalanceChange = e => {
    setAccountForm({ ...accountForm, balance: e });
  };

  const toggleUpdateMode = () => {
    if (accountForm.update_mode === ACCOUNT_UPDATE_MODE_DEFAULT) {
      setAccountForm({
        ...accountForm,
        update_mode: ACCOUNT_UPDATE_MODE_OFFSET_TRANSACTION,
      });
    } else {
      setAccountForm({
        ...accountForm,
        update_mode: ACCOUNT_UPDATE_MODE_DEFAULT,
      });
    }
  };

  const isFormLoading = () => {
    return getAccount.isLoading;
  };

  const isFormButtonLoading = () => {
    return createAccount.isLoading || updateAccount.isLoading;
  };

  const onSave = () => {
    validate();
    let isValidationPassed = Object.keys(formErrors).length === 0;
    if (!isValidationPassed) {
      return;
    }

    let balance;
    if (accountForm.account_type === ACCOUNT_TYPE_INVESTMENT) {
      balance = null;
    } else {
      balance = String(accountForm.balance);
    }

    if (isAddAccount()) {
      createAccount.mutate({
        ...accountForm,
        balance: balance,
      });
      return;
    }

    updateAccount.mutate({
      ...accountForm,
      balance: balance,
    });
  };

  const canSetBalance = () => {
    return accountForm.account_type !== ACCOUNT_TYPE_INVESTMENT;
  };

  const shouldDisableBalance = () => {
    return accountForm.account_type === ACCOUNT_TYPE_LOAN && !isAddAccount();
  };

  useError([getAccount, createAccount, updateAccount]);

  return (
    <BaseScreen
      isLoading={isFormLoading()}
      headerProps={{
        allowBack: true,
        centerComponent: (
          <View style={styles.header}>
            <BaseText h2>
              {isAddAccount() ? 'Add Account' : 'Edit Account'}
            </BaseText>
          </View>
        ),
      }}>
      <BaseKeyboardAwareScrollView
        keyboardShouldPersistTaps="always"
        enableOnAndroid={true}
        keyboardOpeningTime={0}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.formBody}>
        <BaseInput
          label="Account Name"
          value={accountForm.account_name}
          onChangeText={onAccountNameChange}
          clearButtonMode="always"
          maxLength={120}
          errorMessage={showValidation && formErrors.account_name}
        />

        <TouchInput
          label="Account Type"
          hide={!isAddAccount()}
          value={ACCOUNT_TYPES[accountForm.account_type]}
          onPress={toggleAccountTypeModal}
        />
        <BaseBottomSheet
          isVisible={accountTypeModalVisible}
          onBackdropPress={toggleAccountTypeModal}
          close={toggleAccountTypeModal}
          onSelect={onAccountTypeChange}
          items={getAccountTypes()}
          label="name"
        />

        {canSetBalance() && (
          <>
            <BaseCurrencyInput
              label={
                isAccountTypeAsset(accountForm.account_type)
                  ? 'Balance'
                  : 'Amount Owed'
              }
              hide={shouldDisableBalance()}
              value={accountForm.balance === null ? 0 : accountForm.balance}
              onChangeText={onBalanceChange}
              isNegative={isAccountTypeDebt(accountForm.account_type)}
            />

            {!isAddAccount() && (
              <BaseCheckbox
                title={'Add difference in balance as new transaction'}
                containerStyle={styles.checkBox}
                checked={
                  accountForm.update_mode ===
                  ACCOUNT_UPDATE_MODE_OFFSET_TRANSACTION
                }
                onPress={toggleUpdateMode}
              />
            )}
          </>
        )}

        <View style={styles.btnContainer}>
          <BaseButton
            title="Save"
            size="lg"
            width={200}
            onPress={onSave}
            loading={isFormButtonLoading()}
          />
        </View>
      </BaseKeyboardAwareScrollView>
    </BaseScreen>
  );
};

const getStyles = theme =>
  StyleSheet.create({
    btnContainer: {
      marginTop: theme.spacing.lg,
      marginBottom: theme.spacing.md,
    },
    checkBox: { marginTop: 0, marginBottom: 20 },
  });

export default AccountForm;
