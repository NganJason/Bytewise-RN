import { useState } from 'react';
import { StyleSheet } from 'react-native';
import { useTheme, Dialog } from '@rneui/themed';
import { Calendar } from 'react-native-calendars';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import {
  BaseInput,
  BaseCurrencyInput,
  BaseButton,
  BaseScreen,
  BaseBottomSheet,
  BaseTabView,
  BaseText,
  TouchInput,
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

import { ACCOUNTS } from '../../_shared/api/data/mock/account';

import { DAYS } from '../../_shared/constant/constant';

// Initial date
const TODAY = new Date();
const YEAR = `${TODAY.getFullYear()}`;
const MONTH = `${TODAY.getMonth() + 1}`.padStart(2, '0');
const DATE = `${TODAY.getDate()}`.padStart(2, '0');

const AMOUNT_SCROLL_HEIGHT = 0;
const NOTE_SCROLL_HEIGHT = 300;

const TransactionForm = ({ route }) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  const transactionCategories = {
    [TRANSACTION_TYPE_EXPENSE]: EXPENSE_CATEGORIES,
    [TRANSACTION_TYPE_INCOME]: INCOME_CATEGORIES,
  };

  const {
    transaction: {
      timestamp = TODAY.valueOf(),
      amount = '',
      note = '',
      cat = {
        cat_id: 0,
        cat_name: '',
      },
      account = ACCOUNTS[0] || {
        acc_id: 0,
        acc_name: '',
      },
      transaction_type = TRANSACTION_TYPE_EXPENSE,
    },
    isEdit = false,
  } = route.params || { transaction: {}, autoFocus: true };

  const [form, setForm] = useState({
    timestamp: timestamp, // milli unix
    amount: amount,
    note: note,
    cat: cat,
    account: account,
    transaction_type: transaction_type,
  });

  const [scrollHeight, setScrollHeight] = useState(AMOUNT_SCROLL_HEIGHT);

  // for rendering
  const [selectedDate, setSelectedDate] = useState(`${YEAR}-${MONTH}-${DATE}`);

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

  const [isAccountModalVisible, setIsAccountModalVisible] = useState(false);

  const toggleAccountModal = () => {
    setIsAccountModalVisible(!isAccountModalVisible);
  };

  const formatTimestamp = ts => {
    const d = new Date(ts);

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
    setForm({ ...form, transaction_type: e, cat: {} });
    setActiveCategories(transactionCategories[e]);
  };

  const onTimestampChange = e => {
    setForm({ ...form, timestamp: e });
    toggleCalendarModal();
  };

  const onCategoryChange = e => {
    setForm({ ...form, cat: e });
    toggleCategoryModal();
  };

  const onAccountChange = e => {
    setForm({ ...form, account: e });
    toggleAccountModal();
  };

  return (
    <BaseScreen
      headerProps={{
        allowBack: true,
        centerComponent: (
          <BaseText h2>{TRANSACTION_TYPES[form.transaction_type]}</BaseText>
        ),
      }}>
      <>
        <BaseTabView
          onPress={index => onTransactionTypeChange(index + 1)}
          selectedIndex={form.transaction_type - 1}
          titles={[
            TRANSACTION_TYPES[TRANSACTION_TYPE_EXPENSE],
            TRANSACTION_TYPES[TRANSACTION_TYPE_INCOME],
          ]}
        />
        <KeyboardAwareScrollView
          keyboardShouldPersistTaps="always"
          extraHeight={scrollHeight}
          enableOnAndroid={true}
          keyboardOpeningTime={0}
          contentContainerStyle={styles.formBody}>
          <TouchInput
            label="Date"
            value={formatTimestamp(form.timestamp)}
            onPress={toggleCalendarModal}
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
          <TouchInput
            label="Account"
            value={form.account.acc_name}
            onPress={toggleAccountModal}
          />
          <BaseBottomSheet
            isVisible={isAccountModalVisible}
            onBackdropPress={toggleAccountModal}
            close={toggleAccountModal}
            onSelect={onAccountChange}
            items={ACCOUNTS}
            label="acc_name"
          />
          <BaseCurrencyInput
            label="Amount"
            value={form.amount}
            onChangeText={onAmountChange}
            autoFocus={!isEdit}
            onFocus={() => setScrollHeight(AMOUNT_SCROLL_HEIGHT)}
          />
          <TouchInput
            label="Category"
            value={form.cat.cat_name}
            onPress={toggleCategoryModal}
          />
          <BaseBottomSheet
            isVisible={isCategoryModalVisible}
            onBackdropPress={toggleCategoryModal}
            close={toggleCategoryModal}
            onSelect={onCategoryChange}
            items={activeCategories}
            label="cat_name"
          />
          <BaseInput
            label="Note"
            value={form.note}
            onChangeText={onNoteChange}
            clearButtonMode="always"
            onFocus={() => setScrollHeight(NOTE_SCROLL_HEIGHT)}
          />
          <BaseButton title="Save" size="lg" width={200} />
        </KeyboardAwareScrollView>
      </>
    </BaseScreen>
  );
};

export default TransactionForm;

const getStyles = _ =>
  StyleSheet.create({
    formBody: {
      paddingVertical: 20,
    },
  });
