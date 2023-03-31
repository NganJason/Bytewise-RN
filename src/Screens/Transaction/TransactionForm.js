import { useState, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {
  useTheme,
  Header,
  ButtonGroup,
  Icon,
  Dialog,
  BottomSheet,
  ListItem,
} from '@rneui/themed';
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
const EXPENSE_CATEGORIES = [
  { cat_name: 'Food', cat_id: 1 },
  { cat_name: 'Clothes', cat_id: 2 },
  { cat_name: 'Rent', cat_id: 3 },
  { cat_name: 'Sports', cat_id: 4 },
  { cat_name: 'Friends', cat_id: 5 },
  { cat_name: 'Tax', cat_id: 6 },
];

// TODO: REMOVE
const INCOME_CATEGORIES = [
  { cat_name: 'Shopee Salary', cat_id: 4 },
  { cat_name: 'Dividend Income', cat_id: 5 },
];

// TODO: REMOVE
const TRANSACTION_CATEGORIES = {
  [TRANSACTION_EXPENSE]: EXPENSE_CATEGORIES,
  [TRANSACTION_INCOME]: INCOME_CATEGORIES,
};

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
    category: {},
    transaction_type: TRANSACTION_EXPENSE,
  });

  const [isCalendarModalVisible, setIsCalendarModalVisible] = useState(false);

  const toggleCalendarModal = () => {
    setIsCalendarModalVisible(!isCalendarModalVisible);
  };

  const [isCategoryModalVisible, setIsCategoryModalVisible] = useState(false);

  const toggleCategoryModal = () => {
    setIsCategoryModalVisible(!isCategoryModalVisible);
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
    setForm({ ...form, transaction_type: e, category: {} });
  };

  const onDateChange = e => {
    setForm({ ...form, date: e });
    toggleCalendarModal();
  };

  const onCategoryChange = e => {
    setForm({ ...form, category: e });
    toggleCategoryModal();
  };

  const categories = TRANSACTION_CATEGORIES[form.transaction_type];

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
              selectedIndex={form.transaction_type - 1}
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
                onPress={toggleCalendarModal}
                readOnly
              />
              <Dialog
                isVisible={isCalendarModalVisible}
                onBackdropPress={toggleCalendarModal}>
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
                ref={inputRef}
                label="Category"
                value={form.category.cat_name}
                onPress={toggleCategoryModal}
                readOnly
              />
              <BottomSheet
                isVisible={isCategoryModalVisible}
                onBackdropPress={toggleCategoryModal}>
                {categories.map((cat, i) => (
                  <ListItem
                    key={i}
                    onPress={() => onCategoryChange(cat)}
                    containerStyle={styles.modalItem}>
                    <ListItem.Content key={i}>
                      <ListItem.Title>
                        <BaseText>{cat.cat_name}</BaseText>
                      </ListItem.Title>
                    </ListItem.Content>
                  </ListItem>
                ))}
                <BaseButton
                  title="Close"
                  fullWidth
                  size="lg"
                  activeOpacity={1}
                  onPress={toggleCategoryModal}
                />
              </BottomSheet>
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
            <BaseButton title="Save" size="lg" width={200} />
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
    modalItem: {
      paddingHorizontal: theme.spacing.xl,
      paddingVertical: 16, // TODO: SPACING FIX
    },
    modalBtnText: {
      color: theme.colors.white,
      alignSelf: 'center',
    },
  });
