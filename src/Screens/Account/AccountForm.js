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
import { useCreateAccount } from '../../_shared/mutations/account';

const AccountForm = ({ route }) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const navigation = useNavigation();

  const accountID = route.params?.account_id || '';
  const accountType = route.params?.account_type || ACCOUNT_TYPE_BANK_ACCOUNT;
  const isAddAccount = () => {
    return accountID === '';
  };

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
      navigation.goBack();

      // Go back twice for creation flow
      // To skip account selection page
      if (accountID === '') {
        navigation.goBack();
      }
    },
  });

  useEffect(() => {
    if (getAccount.data) {
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

  const isFormLoading = () => {
    return getAccount.isLoading;
  };

  const onSave = () => {
    createAccount.mutate({
      ...accountForm,
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
            loading={createAccount.isLoading}
          />
        </View>
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
  });

export default AccountForm;
