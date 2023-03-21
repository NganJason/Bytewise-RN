import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useTheme, Header } from '@rneui/themed';

import { BaseText, BaseInput, BaseCurrencyInput } from '../../Components';

const TransactionForm = () => {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  const [form, setForm] = useState({
    date: 0,
    amount: '',
    note: '',
    category: 0,
  });

  const onNoteChange = e => {
    setForm({ ...form, note: e });
  };

  const onAmountChange = e => {
    setForm({ ...form, amount: e });
  };

  return (
    <SafeAreaProvider style={styles.screen}>
      <Header
        centerComponent={<BaseText h2>Add Transaction</BaseText>}
        containerStyle={styles.header}
      />
      <View style={styles.formBody}>
        <BaseInput label="Date" value={form.date} />
        <BaseInput label="Note" onChangeText={onNoteChange} value={form.note} />
        {/* <BaseInput
          label="Amount"
          keyboardType="numeric"
          onChangeText={onAmountChange}
          value={form.amount}
        /> */}
        <BaseCurrencyInput onChangeText={onAmountChange} value={form.amount} />
      </View>
    </SafeAreaProvider>
  );
};

export default TransactionForm;

const getStyles = theme =>
  StyleSheet.create({
    screen: {
      display: 'flex',
      alignItems: 'center',
    },
    header: {
      backgroundColor: theme.colors.white,
      borderBottomColor: theme.colors.white,
      paddingVertical: theme.spacing.xl,
    },
    formBody: {
      width: '100%',
      height: '100%',
      padding: theme.spacing.xl,
      marginTop: theme.spacing.md,
    },
  });
