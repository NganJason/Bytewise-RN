import { useContext, useEffect, useState } from 'react';
import { CommonActions, useNavigation } from '@react-navigation/native';
import { useTheme } from '@rneui/themed';
import { StyleSheet, View } from 'react-native';
import {
  BaseKeyboardAwareScrollView,
  BaseBottomSheet,
  BaseButton,
  BaseCheckbox,
  BaseMonetaryInput,
  BaseInput,
  BaseScreen,
  BaseText,
  TouchInput,
  DeleteSaveButton,
} from '../../Components';
import {
  ACCOUNT_TYPES,
  ACCOUNT_TYPE_BANK_ACCOUNT,
  ACCOUNT_TYPE_INVESTMENT,
  ACCOUNT_TYPE_LOAN,
  ACCOUNT_UPDATE_MODE_DEFAULT,
  ACCOUNT_UPDATE_MODE_OFFSET_TRANSACTION,
} from '../../_shared/apis/enum';
import { useGetAccount } from '../../_shared/query';
import { useCreateAccount, useUpdateAccount } from '../../_shared/mutations';
import ROUTES from '../../_shared/constant/routes';
import { validateAccount } from '../../_shared/validator';
import { useError, useValidation } from '../../_shared/hooks';
import { isAccountTypeAsset, isAccountTypeDebt } from '../../_shared/util';
import { OnboardingDataContext } from '../../_shared/context';
import { useDeleteAccount } from '../../_shared/mutations/account';
import { BaseOverlay } from '../../Components/View';
import { UserMetaContext } from '../../_shared/context/UserMetaContext';

const AccountForm = ({ route }) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const navigation = useNavigation();
  const { getUserBaseCurrency } = useContext(UserMetaContext);

  const {
    account_id: accountID = '',
    account_type: accountType = ACCOUNT_TYPE_BANK_ACCOUNT,
    is_onboarding: isOnboarding = false,
    account_onboarding_idx: accountOnboardingIdx = null,
  } = route?.params || {};
  const isAddAccount = () => {
    return accountID === '';
  };

  const [accountForm, setAccountForm] = useState({
    account_id: accountID,
    account_name: '',
    account_type: accountType,
    balance: 0,
    currency: getUserBaseCurrency(),
    update_mode: ACCOUNT_UPDATE_MODE_DEFAULT,
  });

  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const toggleDeleteModal = () => {
    setIsDeleteModalVisible(!isDeleteModalVisible);
  };

  const [formErrors, setFormErrors] = useState({});
  const { validate, showValidation } = useValidation();
  useEffect(() => {
    setFormErrors(validateAccount(accountForm));
  }, [accountForm]);

  // For account onboarding
  const {
    data,
    addAccount: addOnboardingAccount,
    updateAccount: updateOnboardingAccount,
  } = useContext(OnboardingDataContext);

  const getAccount = useGetAccount(
    { account_id: accountID },
    { enabled: accountID !== '' },
  );

  const createAccount = useCreateAccount({
    onSuccess: resp => {
      const { account_id: newAccountID = '' } = resp?.account || [];

      // If it's investment account, redirect to investment breakdown screen
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

  const deleteAccount = useDeleteAccount({
    onSuccess: () => {
      if (isDeleteModalVisible) {
        toggleDeleteModal();
      }
      navigation.goBack();
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

  // For account onboarding update
  useEffect(() => {
    if (accountOnboardingIdx === null) {
      return;
    }

    let { accounts = [] } = data;
    let account = accounts[accountOnboardingIdx];
    if (!account || account === null) {
      return;
    }

    setAccountForm({
      account_name: account.account_name,
      account_type: account.account_type,
      balance: account.balance,
    });
  }, [data, accountOnboardingIdx]);

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

  const onCurrencyChange = e => {
    setAccountForm({ ...accountForm, currency: e.code });
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
    } else if (isAccountTypeAsset(accountForm.account_type)) {
      balance = String(accountForm.balance);
    } else if (
      isAccountTypeDebt(accountForm.account_type) &&
      accountForm.balance > 0
    ) {
      balance = String(accountForm.balance * -1);
    }

    if (isOnboarding) {
      let isOnboardingUpdate = accountOnboardingIdx !== null;

      if (isOnboardingUpdate) {
        updateOnboardingAccount(accountOnboardingIdx, {
          ...accountForm,
          balance: balance,
        });
        navigation.goBack();
      } else {
        addOnboardingAccount({ ...accountForm, balance: balance });
        navigation.goBack();
        navigation.goBack();
      }

      return;
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

  const getAccountTypes = () => {
    let accountTypes = [];
    for (const account_enum in ACCOUNT_TYPES) {
      if (isOnboarding) {
        if (account_enum === ACCOUNT_TYPE_INVESTMENT) {
          continue;
        }
      }

      accountTypes.push({
        name: ACCOUNT_TYPES[account_enum],
        value: Number(account_enum),
      });
    }

    return accountTypes;
  };

  const onDelete = () => {
    if (accountForm.account_type === ACCOUNT_TYPE_INVESTMENT) {
      toggleDeleteModal();
      return;
    }
    deleteAccount.mutate({ account_id: accountForm.account_id });
  };

  const onDeleteInvestmentAccount = () => {
    deleteAccount.mutate({ account_id: accountForm.account_id });
  };

  useError([getAccount, createAccount, updateAccount, deleteAccount]);

  return (
    <BaseScreen
      isLoading={isFormLoading()}
      scrollable
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
          autoFocus
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
            <BaseMonetaryInput
              label={
                isAccountTypeAsset(accountForm.account_type)
                  ? 'Balance'
                  : 'Amount Owed'
              }
              value={
                accountForm.balance === null ? 0 : Math.abs(accountForm.balance)
              }
              currency={isOnboarding ? data.currency : accountForm.currency}
              onChangeText={onBalanceChange}
              onChangeCurrency={onCurrencyChange}
              hide={shouldDisableBalance()}
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

        <DeleteSaveButton
          onSave={onSave}
          isSaveLoading={isFormButtonLoading()}
          onDelete={onDelete}
          isDeleteLoading={deleteAccount.isLoading}
          allowDelete={!isAddAccount()}
        />

        <BaseOverlay
          isVisible={isDeleteModalVisible}
          onBackdropPress={toggleDeleteModal}>
          <View style={styles.overlay}>
            <BaseText text3>{'All holdings under this account'}</BaseText>
            <BaseText text3>{'will be deleted'}</BaseText>
            <BaseText margin={{ vertical: 15 }}>
              Do you want to proceed?
            </BaseText>

            <View style={styles.overlayBtnContainer}>
              <BaseButton
                title="No"
                type="outline"
                size="lg"
                width={200}
                onPress={toggleDeleteModal}
              />
            </View>
            <BaseButton
              title="Yes"
              size="lg"
              width={200}
              onPress={onDeleteInvestmentAccount}
              loading={deleteAccount.isLoading}
            />
          </View>
        </BaseOverlay>
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
    overlayBtnContainer: {
      marginBottom: theme.spacing.lg,
      marginTop: theme.spacing.sm,
    },
    overlay: {
      alignItems: 'center',
    },
  });

export default AccountForm;
