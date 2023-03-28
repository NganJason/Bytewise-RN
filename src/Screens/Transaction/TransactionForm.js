import { useState, useRef, useMemo, useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useTheme, Header, ButtonGroup, Icon } from '@rneui/themed';
import { Calendar } from 'react-native-calendars';
import {
  BottomSheetModal,
  useBottomSheetDynamicSnapPoints,
  BottomSheetView,
  BottomSheetModalProvider,
} from '@gorhom/bottom-sheet';
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

const TODAY = new Date();
const YEAR = `${TODAY.getFullYear()}`;
const MONTH = `${TODAY.getMonth() + 1}`.padStart(2, '0');
const DATE = `${TODAY.getDate()}`;

const TransactionForm = () => {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  const dateRef = useRef(null);
  const amountRef = useRef(null);
  const modalRef = useRef(null);

  const [selectedTransactionType, setSelectedTransactionType] =
    useState(TRANSACTION_EXPENSE);

  const snapPoints = useMemo(() => ['CONTENT_HEIGHT'], []);

  const {
    animatedHandleHeight,
    animatedSnapPoints,
    animatedContentHeight,
    handleContentLayout,
  } = useBottomSheetDynamicSnapPoints(snapPoints);

  const presentModal = useCallback(() => {
    modalRef.current?.present();
  }, []);

  const dismissModal = useCallback(() => {
    modalRef.current?.dismiss();
  }, []);

  // for rendering
  const [selectedDate, setSelectedDate] = useState(`${YEAR}-${MONTH}-${DATE}`);

  const formatDate = date => {
    let [yyyy, mm, dd] = date.split('-');
    if (mm.length === 2 && mm[0] === '0') {
      mm = mm[1];
    }
    return `${yyyy}/${mm}/${dd}`;
  };

  const [form, setForm] = useState({
    timestamp: TODAY.valueOf(), // unix
    amount: '',
    note: '',
    category: '',
  });

  const onNoteChange = e => {
    setForm({ ...form, note: e });
  };

  const onAmountChange = e => {
    setForm({ ...form, amount: e });
  };

  const onDateChange = e => {
    setForm({ ...form, date: e });
    blurDateInput();
    focusAmountInput();
  };

  const blurDateInput = () => {
    dateRef.current?.blur();
  };

  const focusAmountInput = () => {
    amountRef.current?.focus();
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
          extraHeight={300}
          keyboardOpeningTime={0}>
          <View style={styles.form}>
            <ButtonGroup
              onPress={index => setSelectedTransactionType(index + 1)}
              selectedIndex={selectedTransactionType - 1}
              buttons={[
                TRANSACTION_TYPES[TRANSACTION_INCOME],
                TRANSACTION_TYPES[TRANSACTION_EXPENSE],
              ]}
            />
            <View style={styles.formBody}>
              <BaseInput
                ref={dateRef}
                label="Date"
                value={formatDate(selectedDate)}
                carretHidden
                showSoftInputOnFocus={false}
                onFocus={() => presentModal()}
                onBlur={() => dismissModal()}
              />
              <BaseCurrencyInput
                ref={amountRef}
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
                  <Icon
                    name="clear"
                    type="material-icons"
                    onPress={() => onNoteChange('')}
                  />
                }
              />
            </View>
            <BaseButton title="Save" width={150} size="lg" />
          </View>
        </KeyboardAwareScrollView>
        {/* https://github.com/gorhom/react-native-bottom-sheet/issues/341 */}
        <BottomSheetModalProvider>
          <BottomSheetModal
            waitFor
            simultaneousHandlers
            ref={modalRef}
            snapPoints={animatedSnapPoints}
            handleHeight={animatedHandleHeight}
            contentHeight={animatedContentHeight}
            enablePanDownToClose
            onDismiss={blurDateInput}>
            <BottomSheetView onLayout={handleContentLayout}>
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
            </BottomSheetView>
          </BottomSheetModal>
        </BottomSheetModalProvider>
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
