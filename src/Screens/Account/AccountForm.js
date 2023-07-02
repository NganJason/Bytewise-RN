import { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '@rneui/themed';
import { StyleSheet, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import {
  BaseBottomSheet,
  BaseButton,
  BaseCurrencyInput,
  BaseInput,
  BaseScreen,
  BaseText,
  TouchInput,
} from '../../Components';
import {
  ACCOUNT_TYPES,
  ACCOUNT_TYPE_BANK_ACCOUNT,
} from '../../_shared/apis/enum';
import { getAccountTypes } from '../../_shared/util/budget';
import { useGetAccount } from '../../_shared/query/account';
import {
  useCreateAccount,
  useUpdateAccount,
} from '../../_shared/mutations/account';
import { BaseOverlay } from '../../Components/View';

const AccountForm = ({ route }) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const navigation = useNavigation();

  const accountID = route.params?.account_id || '';
  const accountType = route.params?.account_type || ACCOUNT_TYPE_BANK_ACCOUNT;
  const isAddAccount = () => {
    return accountID === '';
  };

  const [isModalVisible, setIsModalVisible] = useState(false);
  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  const [isBalanceUpdated, setIsBalanceUpdated] = useState(false);

  const [accountForm, setAccountForm] = useState({
    account_name: '',
    account_type: accountType,
    balance: 0,
  });

  const getAccount = useGetAccount(
    { account_id: accountID },
    { enabled: accountID !== '' },
  );

  const createAccount = useCreateAccount({
    onSuccess: () => {
      // Go back twice for creation flow
      // To skip account selection page
      navigation.goBack();
      navigation.goBack();
    },
  });

  const updateAccount = useUpdateAccount({
    onSuccess: () => {
      if (isModalVisible) {
        toggleModal();
      }
      navigation.goBack();
    },
  });

  useEffect(() => {
    const { account } = getAccount?.data || {};
    if (account !== undefined) {
      setAccountForm({
        ...account,
        balance: Number(account.balance),
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
    if (!isAddAccount()) {
      setIsBalanceUpdated(true);
    }
    setAccountForm({ ...accountForm, balance: e });
  };

  const isFormLoading = () => {
    return getAccount.isLoading;
  };

  const isFormButtonLoading = () => {
    return createAccount.isLoading || updateAccount.isLoading;
  };

  const onSave = () => {
    if (isAddAccount()) {
      createAccount.mutate({
        ...accountForm,
        balance: String(accountForm.balance),
      });
      return;
    }

    if (isBalanceUpdated && !isModalVisible) {
      toggleModal();
      return;
    }

    updateAccount.mutate({
      ...accountForm,
      account_id: accountID,
      balance: String(accountForm.balance),
    });
  };

  return (
    <BaseScreen
      isLoading={isFormLoading()}
      headerProps={{
        allowBack: true,
        centerComponent: (
          <View style={styles.header}>
            <BaseText h2>
              {isAddAccount() ? 'Add account' : 'Edit account'}
            </BaseText>
          </View>
        ),
      }}>
      <KeyboardAwareScrollView
        keyboardShouldPersistTaps="always"
        enableOnAndroid={true}
        keyboardOpeningTime={0}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.formBody}>
        <BaseInput
          label="Account name"
          value={accountForm.account_name}
          onChangeText={onAccountNameChange}
          clearButtonMode="always"
          maxLength={120}
        />

        <TouchInput
          label="Account type"
          disabled={!isAddAccount()}
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

        <BaseCurrencyInput
          label="Balance"
          value={accountForm.balance}
          onChangeText={onBalanceChange}
        />

        <View style={styles.btnContainer}>
          <BaseButton
            title="Save"
            size="lg"
            width={200}
            onPress={onSave}
            loading={isFormButtonLoading()}
          />
        </View>

        <BaseOverlay isVisible={isModalVisible}>
          <View style={styles.overlay}>
            <BaseText>
              The difference in balance will be registered as an expense/income.
            </BaseText>
            <BaseText margin={{ vertical: 15 }}>
              Do you want to proceed?
            </BaseText>

            <View style={styles.overlayBtnContainer}>
              <BaseButton
                title="Yes"
                size="lg"
                width={200}
                onPress={onSave}
                loading={isFormButtonLoading()}
              />
            </View>

            <BaseButton
              title="No"
              type="outline"
              size="lg"
              width={200}
              onPress={toggleModal}
            />
          </View>
        </BaseOverlay>
      </KeyboardAwareScrollView>
    </BaseScreen>
  );
};

const getStyles = theme =>
  StyleSheet.create({
    btnContainer: {
      marginTop: theme.spacing.lg,
      marginBottom: theme.spacing.md,
    },
    overlayBtnContainer: {
      marginBottom: theme.spacing.lg,
      marginTop: theme.spacing.sm,
    },
    overlay: {
      alignItems: 'center',
    },
  });

export default AccountForm;
