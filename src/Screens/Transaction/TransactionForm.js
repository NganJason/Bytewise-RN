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

  const transaction = route.params?.transaction || {};
  const [transactionForm, setTransactionForm] = useState({
    transaction_id: transaction.transaction_id || '',
    transaction_time: transaction.transaction_time || TODAY.valueOf(),
    transaction_type: transaction.transaction_type || TRANSACTION_TYPE_EXPENSE,
    amount: transaction.amount || '',
    category_id: transaction.category_id || 0,
    note: transaction.note || '',
  });

  const [scrollHeight, setScrollHeight] = useState(AMOUNT_SCROLL_HEIGHT);

  // for rendering
  const [selectedDate, setSelectedDate] = useState(`${YEAR}-${MONTH}-${DATE}`);

  const [activeCategories, setActiveCategories] = useState([]);

  const [isCalendarModalVisible, setIsCalendarModalVisible] = useState(false);
  const toggleCalendarModal = () => {
    setIsCalendarModalVisible(!isCalendarModalVisible);
  };

  const [isCategoryModalVisible, setIsCategoryModalVisible] = useState(false);
  const toggleCategoryModal = () => {
    setIsCategoryModalVisible(!isCategoryModalVisible);
  };

  useEffect(() => {
    const getActiveCategories = () => {
      let categories = CATEGORIES.filter(
        d => d.cat_type === transactionForm.transaction_type,
      );
      return categories;
    };

    setTransactionForm(prev => ({
      ...prev,
      transaction_type: transactionForm.transaction_type,
      cat: {},
    }));
    setActiveCategories(getActiveCategories());
  }, [transactionForm.transaction_type]);

  const formatTimestamp = ts => {
    const d = new Date(ts);

    const yyyy = d.getFullYear();
    const mm = d.getMonth() + 1;
    const date = d.getDate();
    const day = DAYS[d.getDay()];

    return `${date}/${mm}/${yyyy} (${day})`;
  };

  const onNoteChange = e => {
    setTransactionForm({ ...transactionForm, note: e });
  };

  const onAmountChange = e => {
    setTransactionForm({ ...transactionForm, amount: e });
  };

  const onTransactionTypeChange = e => {
    setTransactionForm({ ...transactionForm, transaction_type: e });
  };

  const onTimestampChange = e => {
    setTransactionForm({ ...transactionForm, timestamp: e });
    toggleCalendarModal();
  };

  const onCategoryChange = e => {
    setTransactionForm({ ...transactionForm, cat: e });
    toggleCategoryModal();
  };

  const onEditCategory = () => {
    navigation.navigate(ROUTES.categoryEdit);
    toggleCategoryModal();
  };

  return (
    <BaseScreen
      headerProps={{
        allowBack: true,
        centerComponent: (
          <BaseText h2>
            {TRANSACTION_TYPES[transactionForm.transaction_type]}
          </BaseText>
        ),
      }}>
      <>
        <BaseTabView
          onPress={index => onTransactionTypeChange(index + 1)}
          selectedIndex={transactionForm.transaction_type - 1}
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
            value={formatTimestamp(transactionForm.timestamp)}
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
          <BaseCurrencyInput
            label="Amount"
            value={transactionForm.amount}
            onChangeText={onAmountChange}
            autoFocus={transactionForm.transaction_id === ''}
            onFocus={() => setScrollHeight(AMOUNT_SCROLL_HEIGHT)}
          />
          <TouchInput
            label="Category"
            value={transactionForm.cat.cat_name}
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
            value={transactionForm.note}
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
