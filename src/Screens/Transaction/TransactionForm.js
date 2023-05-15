import { useState, useEffect } from 'react';
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
  IconButton,
} from '../../Components';

import {
  TRANSACTION_TYPE_EXPENSE,
  TRANSACTION_TYPE_INCOME,
  TRANSACTION_TYPES,
} from '../../_shared/apis/enum';

import { CATEGORIES } from '../../_shared/mock_data/category';

import { ACCOUNTS } from '../../_shared/mock_data/account';

import { DAYS } from '../../_shared/constant/constant';
import { useNavigation } from '@react-navigation/native';
import ROUTES from '../../_shared/constant/routes';

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
  const navigation = useNavigation();

  const {
    id = 0,
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
  } = route.params?.transaction || {};

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

  const [transactionType, setTransactionType] = useState(transaction_type);

  const [activeCategories, setActiveCategories] = useState([]);

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

  useEffect(() => {
    const getActiveCategories = () => {
      let categories = CATEGORIES.filter(d => d.cat_type === transactionType);
      return categories;
    };

    setForm(prev => ({ ...prev, transaction_type: transactionType, cat: {} }));
    setActiveCategories(getActiveCategories());
  }, [transactionType]);

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
    setTransactionType(e);
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

  const onEditCategory = () => {
    navigation.navigate(ROUTES.categoryEdit, { categoryType: transactionType });
    toggleCategoryModal();
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
          showsVerticalScrollIndicator={false}
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
            autoFocus={id === 0}
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
            headerItems={[
              <IconButton
                iconName="edit"
                iconType="fontawesome"
                type="clear"
                buttonSize="sm"
                color="grey"
                style={styles.editBtn}
                onPress={onEditCategory}
              />,
            ]}
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
      paddingVertical: 22,
    },
  });
