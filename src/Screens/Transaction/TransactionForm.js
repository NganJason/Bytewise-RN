import { useState, useRef, useMemo, useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useTheme, Header } from '@rneui/themed';
import { Calendar } from 'react-native-calendars';

import {
  BottomSheetModal,
  useBottomSheetDynamicSnapPoints,
  BottomSheetView,
  BottomSheetModalProvider,
} from '@gorhom/bottom-sheet';

import {
  BaseText,
  BaseInput,
  BaseCurrencyInput,
  HideKeyboard,
} from '../../Components';

const TODAY = new Date();
const YEAR = `${TODAY.getFullYear()}`;
const MONTH = `${TODAY.getMonth() + 1}`.padStart(2, '0');
const DAY = `${TODAY.getDate()}`;

const TransactionForm = () => {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  const dateRef = useRef(null);
  const amountRef = useRef(null);
  const modalRef = useRef(null);

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
  const [selectedDate, setSelectedDate] = useState(`${YEAR}-${MONTH}-${DAY}`);

  const formatDate = date => {
    let [yyyy, mm, dd] = date.split('-');
    if (mm.length === 2 && mm[0] === '0') {
      mm = mm[1];
    }
    return `${yyyy}/${mm}/${dd}`;
  };

  const [form, setForm] = useState({
    date: 0,
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
          />
        </View>
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
