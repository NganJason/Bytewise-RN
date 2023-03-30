import { useState, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useTheme, Header, ButtonGroup, Icon, Dialog } from '@rneui/themed';
import { Calendar } from 'react-native-calendars';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import {
  BaseText,
  BaseInput,
  BaseCurrencyInput,
  BaseButton,
  HideKeyboard,
} from '../../Components';

import {
  TRANSACTION_EXPENSE,
  TRANSACTION_INCOME,
  TRANSACTION_TYPES,
} from '../../_shared/api/data/model';

// TODO: REMOVE
// const EXPENSE_CATEGORIES = [
//   { categoryName: 'Food', categoryID: 1 },
//   { categoryName: 'Lunch', categoryID: 2, parent: 1 },
//   { categoryName: 'Dinner', categoryID: 3, parent: 1 },
// ];

// TODO: REMOVE
// const INCOME_CATEGORIES = [
//   { categoryName: 'Shopee Salary', categoryID: 3 },
//   { categoryName: 'Dividend Income', categoryID: 4 },
// ];

const TODAY = new Date();
const YEAR = `${TODAY.getFullYear()}`;
const MONTH = `${TODAY.getMonth() + 1}`.padStart(2, '0');
const DATE = `${TODAY.getDate()}`;

const TransactionForm = () => {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  const inputRef = useRef(null);

  // for rendering
  const [selectedDate, setSelectedDate] = useState(`${YEAR}-${MONTH}-${DATE}`);

  const [form, setForm] = useState({
    timestamp: TODAY.valueOf(), // unix
    amount: '',
    note: '',
    category: '',
    transactionType: TRANSACTION_EXPENSE,
  });

  const [isCalendarModalVisible, setIsCalendarModalVisible] = useState(false);

  const openCalendarModal = () => {
    setIsCalendarModalVisible(true);
  };

  const closeCalendarModal = () => {
    setIsCalendarModalVisible(false);
  };

  const formatDate = date => {
    let [yyyy, mm, dd] = date.split('-');
    if (mm.length === 2 && mm[0] === '0') {
      mm = mm[1];
    }
    return `${yyyy}/${mm}/${dd}`;
  };

  const onNoteChange = e => {
    setForm({ ...form, note: e });
  };

  const onAmountChange = e => {
    setForm({ ...form, amount: e });
  };

  const onTransactionTypeChange = e => {
    setForm({ ...form, transactionType: e });
  };

  const onDateChange = e => {
    setForm({ ...form, date: e });
    closeCalendarModal();
  };

  return (
    <HideKeyboard>
      <SafeAreaProvider style={styles.screen}>
        <Header
          centerComponent={<BaseText h2>Add Transaction</BaseText>}
          containerStyle={styles.header}
        />
        <KeyboardAwareScrollView
          style={styles.scrollView}
          extraHeight={200}
          enableOnAndroid={true}
          keyboardOpeningTime={0}>
          <View style={styles.form}>
            <ButtonGroup
              onPress={index => onTransactionTypeChange(index + 1)}
              selectedIndex={form.transactionType - 1}
              buttons={[
                TRANSACTION_TYPES[TRANSACTION_EXPENSE],
                TRANSACTION_TYPES[TRANSACTION_INCOME],
              ]}
            />
            <View style={styles.formBody}>
              <BaseInput
                ref={inputRef}
                label="Date"
                value={formatDate(selectedDate)}
                onPress={openCalendarModal}
                readOnly
              />
              <Dialog
                isVisible={isCalendarModalVisible}
                onBackdropPress={closeCalendarModal}>
                <Calendar
                  showSixWeeks
                  initialDate={selectedDate}
                  hideExtraDays={false}
                  onDayPress={obj => {
                    setSelectedDate(obj.dateString);
                    onDateChange(obj.timestamp);
                  }}
                  markedDates={{
                    [selectedDate]: {
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
              <BaseCurrencyInput
                label="Amount"
                value={form.amount}
                onChangeText={onAmountChange}
                autoFocus
              />
              <BaseInput
                label="Note"
                value={form.note}
                onChangeText={onNoteChange}
                rightIcon={
                  <BaseButton
                    onPress={() => onNoteChange('')}
                    type="clear"
                    title={<Icon name="clear" type="material-icons" />}
                  />
                }
              />
            </View>
            <BaseButton title="Save" width={150} size="lg" />
          </View>
        </KeyboardAwareScrollView>
      </SafeAreaProvider>
    </HideKeyboard>
  );
};

export default TransactionForm;

const getStyles = theme =>
  StyleSheet.create({
    scrollView: {
      width: '100%',
    },
    header: {
      backgroundColor: theme.colors.white,
      borderBottomColor: theme.colors.white,
      paddingTop: theme.spacing.xl,
    },
    form: {
      width: '100%',
      height: '100%',
      padding: theme.spacing.xl,
    },
    formBody: {
      marginVertical: theme.spacing.xl,
    },
  });
