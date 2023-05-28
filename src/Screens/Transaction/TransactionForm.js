import { useState } from 'react';
import { StyleSheet } from 'react-native';
import { useTheme, Dialog } from '@rneui/themed';
import { Calendar } from 'react-native-calendars';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useNavigation } from '@react-navigation/native';

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

import ROUTES from '../../_shared/constant/routes';
import { DAYS } from '../../_shared/constant/constant';
import { useGetCategories, useGetTransaction } from '../../_shared/query';
import {
  useCreateTransaction,
  useUpdateTransaction,
} from '../../_shared/mutations';
import { validateTransaction } from '../../_shared/apis/transaction';
import { getYear, getMonth, getDate, getDay } from '../../_shared/util/date';

const AMOUNT_SCROLL_HEIGHT = 0;
const NOTE_SCROLL_HEIGHT = 300;

const TransactionForm = ({ route }) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const navigation = useNavigation();

  const [transactionForm, setTransactionForm] = useState({
    transaction_id: '',
    transaction_time: new Date().valueOf(),
    transaction_type: TRANSACTION_TYPE_EXPENSE,
    amount: '',
    note: '',
    category: {
      category_id: '',
      category_name: '',
    },
  });

  const transactionID = route.params?.transaction_id || '';

  const isGetTransactionEnabled = () => transactionID !== '';

  const getTransaction = useGetTransaction(
    { transaction_id: transactionID },
    {
      onSuccess: data => {
        const transaction = data.transaction || {};
        setTransactionForm({
          transaction_id: transaction.transaction_id,
          transaction_time: transaction.transaction_time,
          transaction_type: transaction.transaction_type,
          amount: transaction.amount,
          note: transaction.note,
          category: {
            category_id: transaction.category.category_id,
            category_name: transaction.category.category_name,
          },
        });
      },
      enabled: isGetTransactionEnabled(),
    },
  );

  const [scrollHeight, setScrollHeight] = useState(AMOUNT_SCROLL_HEIGHT);

  const formatTimestampForCalendar = ts => {
    const date = new Date(ts);
    const year = `${getYear(date)}`;
    const month = `${getMonth(date)}`.padStart(2, '0');
    const day = `${getDate(date)}`.padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const [isCalendarModalVisible, setIsCalendarModalVisible] = useState(false);
  const toggleCalendarModal = () => {
    setIsCalendarModalVisible(!isCalendarModalVisible);
  };

  const [isCategoryModalVisible, setIsCategoryModalVisible] = useState(false);
  const toggleCategoryModal = () => {
    setIsCategoryModalVisible(!isCategoryModalVisible);
  };

  const [categories, setCategories] = useState([]);

  const getCategories = useGetCategories(
    {
      category_type: transactionForm.transaction_type,
    },
    {
      onSuccess: function (data) {
        setCategories(data.categories);
      },
    },
  );

  const renderTimestamp = ts => {
    const d = new Date(ts);

    const yyyy = getYear(d);
    const mm = getMonth(d);
    const date = getDate(d);
    const day = DAYS[getDay(d)];

    return `${date}/${mm}/${yyyy} (${day})`;
  };

  const createTransaction = useCreateTransaction({
    onSuccess: navigation.goBack,
  });

  const updateTransaction = useUpdateTransaction({
    onSuccess: navigation.goBack,
  });

  const onFormSubmit = () => {
    let mutation;
    if (transactionForm.transaction_id !== '') {
      mutation = updateTransaction;
    } else {
      mutation = createTransaction;
    }
    mutation.mutate({
      ...transactionForm,
      category_id: transactionForm.category.category_id,
    });
  };

  const isValidTransaction = () => {
    try {
      validateTransaction({
        ...transactionForm,
        category_id: transactionForm.category.category_id,
      });
      return true;
    } catch {
      return false;
    }
  };

  const onNoteChange = e => {
    setTransactionForm({ ...transactionForm, note: e });
  };

  const onAmountChange = e => {
    setTransactionForm({ ...transactionForm, amount: e });
  };

  const onTransactionTypeChange = e => {
    setTransactionForm({
      ...transactionForm,
      transaction_type: e,
      category: {
        category_id: '',
        category_name: '',
      },
    });
  };

  const onTransactionTimeChange = e => {
    setTransactionForm({
      ...transactionForm,
      transaction_time: e,
    });
    toggleCalendarModal();
  };

  const onCategoryChange = e => {
    setTransactionForm({
      ...transactionForm,
      category: {
        category_id: e.category_id,
        category_name: e.category_name,
      },
    });
    toggleCategoryModal();
  };

  const onEditCategory = () => {
    navigation.navigate(ROUTES.categoryEdit, {
      category_type: transactionForm.transaction_type,
    });
    toggleCategoryModal();
  };

  const renderErrorToast = () => {
    if (getTransaction.isError) {
      return {
        show: getTransaction.isError,
        message1: getTransaction.error.message,
        onHide: getTransaction.reset,
      };
    }

    if (getCategories.isError) {
      return {
        show: getCategories.isError,
        message1: getCategories.error.message,
        onHide: getCategories.reset,
      };
    }

    if (createTransaction.isError) {
      return {
        show: createTransaction.isError,
        message1: createTransaction.error.message,
        onHide: createTransaction.reset,
      };
    }

    if (updateTransaction.isError) {
      return {
        show: updateTransaction.isError,
        message1: updateTransaction.error.message,
        onHide: updateTransaction.reset,
      };
    }

    return {};
  };

  const isFormButtonLoading = () => {
    return createTransaction.isLoading || updateTransaction.isLoading;
  };

  const isFormLoading = () => {
    return (
      (isGetTransactionEnabled() && getTransaction.isLoading) ||
      getCategories.isLoading
    );
  };

  return (
    <BaseScreen
      isLoading={isFormLoading()}
      errorToast={renderErrorToast()}
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
            value={renderTimestamp(transactionForm.transaction_time)}
            onPress={toggleCalendarModal}
          />
          <Dialog
            isVisible={isCalendarModalVisible}
            onBackdropPress={toggleCalendarModal}>
            <Calendar
              showSixWeeks
              initialDate={formatTimestampForCalendar(
                transactionForm.transaction_time,
              )}
              hideExtraDays={false}
              onDayPress={obj => {
                onTransactionTimeChange(
                  new Date(obj.timestamp).setHours(0, 0, 0, 0),
                );
              }}
              markedDates={{
                [formatTimestampForCalendar(transactionForm.transaction_time)]:
                  {
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
            value={transactionForm.category.category_name}
            onPress={toggleCategoryModal}
          />
          <BaseBottomSheet
            isVisible={isCategoryModalVisible}
            onBackdropPress={toggleCategoryModal}
            close={toggleCategoryModal}
            onSelect={onCategoryChange}
            items={categories}
            label="category_name"
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
            maxLength={120}
          />
          <BaseButton
            title="Save"
            size="lg"
            width={200}
            disabled={!isValidTransaction()}
            onPress={onFormSubmit}
            loading={isFormButtonLoading()}
          />
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
