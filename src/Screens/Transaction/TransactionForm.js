import { useState } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import {
  useTheme,
  Header,
  ButtonGroup,
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
  TRANSACTION_TYPE_EXPENSE,
  TRANSACTION_TYPE_INCOME,
  TRANSACTION_TYPES,
} from '../../_shared/api/data/model';

import {
  EXPENSE_CATEGORIES,
  INCOME_CATEGORIES,
} from '../../_shared/api/data/mock/category';

import { DAYS } from '../../_shared/constant/constant';

// Initial date
const TODAY = new Date();
const YEAR = `${TODAY.getFullYear()}`;
const MONTH = `${TODAY.getMonth() + 1}`.padStart(2, '0');
const DATE = `${TODAY.getDate()}`.padStart(2, '0');

const { height: WINDOW_HEIGHT } = Dimensions.get('window');

const TransactionForm = () => {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  const transactionCategories = {
    [TRANSACTION_TYPE_EXPENSE]: EXPENSE_CATEGORIES,
    [TRANSACTION_TYPE_INCOME]: INCOME_CATEGORIES,
  };

  // for rendering
  const [selectedDate, setSelectedDate] = useState(`${YEAR}-${MONTH}-${DATE}`);

  const [form, setForm] = useState({
    timestamp: TODAY.valueOf(), // milli unix
    amount: '',
    note: '',
    category: {},
    transaction_type: TRANSACTION_TYPE_EXPENSE,
  });

  const [activeCategories, setActiveCategories] = useState(
    transactionCategories[form.transaction_type],
  );

  const [isCalendarModalVisible, setIsCalendarModalVisible] = useState(false);

  const toggleCalendarModal = () => {
    setIsCalendarModalVisible(!isCalendarModalVisible);
  };

  const [isCategoryModalVisible, setIsCategoryModalVisible] = useState(false);

  const toggleCategoryModal = () => {
    setIsCategoryModalVisible(!isCategoryModalVisible);
  };

  const formatTimestamp = timestamp => {
    const d = new Date(timestamp);

    const yyyy = d.getFullYear();
    const mm = d.getMonth() + 1;
    const date = d.getDate();
    const day = DAYS[d.getDay()];

    return `${date}/${mm}/${yyyy} (${day})`;
  };

  const onNoteChange = e => {
    setForm({ ...form, note: e });
  };

  const onAmountChange = e => {
    setForm({ ...form, amount: e });
  };

  const onTransactionTypeChange = e => {
    setForm({ ...form, transaction_type: e, category: {} });
    setActiveCategories(transactionCategories[e]);
  };

  const onTimestampChange = e => {
    setForm({ ...form, timestamp: e });
    toggleCalendarModal();
  };

  const onCategoryChange = e => {
    setForm({ ...form, category: e });
    toggleCategoryModal();
  };

  return (
    <HideKeyboard>
      <>
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
                TRANSACTION_TYPES[TRANSACTION_TYPE_EXPENSE],
                TRANSACTION_TYPES[TRANSACTION_TYPE_INCOME],
              ]}
            />
            <View style={styles.formBody}>
              <BaseInput
                label="Date"
                value={formatTimestamp(form.timestamp)}
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
                    onTimestampChange(obj.timestamp);
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
                label="Category"
                value={form.category.cat_name}
                onPress={toggleCategoryModal}
                readOnly
              />
              <BottomSheet
                scrollViewProps={{ style: { maxHeight: WINDOW_HEIGHT / 2 } }}
                isVisible={isCategoryModalVisible}
                onBackdropPress={toggleCategoryModal}>
                {activeCategories.map((cat, i) => (
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
                clearButtonMode="always"
              />
            </View>
            <BaseButton title="Save" size="lg" width={200} />
          </View>
        </KeyboardAwareScrollView>
      </>
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
