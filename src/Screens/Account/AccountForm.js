import { useNavigation } from '@react-navigation/native';
import { useTheme } from '@rneui/themed';
import { useState } from 'react';
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
import ROUTES from '../../_shared/constant/routes';
import { getAccountTypes } from '../../_shared/util/budget';

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

  const [accountTypeModalVisible, setAccountTypeModalVisible] = useState(false);
  const toggleAccountTypeModal = () => {
    setAccountTypeModalVisible(!accountTypeModalVisible);
  };

  const onAccountNameChange = e => {
    setAccountForm({ ...accountForm, account_name: e });
  };

  const onAccountTypeChange = e => {
    toggleAccountTypeModal();
    setAccountForm({ ...accountForm, account_type: e.value });
  };

  const onBalanceChange = e => {
    setAccountForm({ ...accountForm, balance: e });
  };

  const onSave = () => {
    navigation.navigate(ROUTES.account);
  };

  return (
    <BaseScreen
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
          label="Budget type"
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
          <BaseButton title="Save" size="lg" width={200} onPress={onSave} />
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
