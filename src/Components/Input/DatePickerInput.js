import { useTheme } from '@rneui/themed';
import { useState } from 'react';
import { StyleSheet } from 'react-native';
import { useDimension } from '../../_shared/hooks';
import { getYearMonthString, getYearString } from '../../_shared/util';
import { DatePickerMode } from './Picker/DatePicker';
import DatePickerBottomSheet from './Picker/DatePickerBottomSheet';
import TouchInput from './TouchInput';

const DatePickerInput = ({
  label = '',
  dateValue = new Date(),
  mode = DatePickerMode.Year,
  onSelect = function () {},
  ...props
}) => {
  const { screenHeight } = useDimension();
  const { theme } = useTheme();
  const styles = getStyles(theme, screenHeight);

  const [selectedDate, setSelectedDate] = useState(dateValue);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  const onChangeHandler = e => {
    setSelectedDate(e);
  };

  const onDone = () => {
    onSelect(selectedDate);
    toggleModal();
  };

  const onCancel = () => {
    setSelectedDate(dateValue);
    toggleModal();
  };

  const getFormattedDateString = () => {
    switch (mode) {
      case DatePickerMode.Year:
        return getYearString(selectedDate);
      case DatePickerMode.YearMonth:
        return getYearMonthString(selectedDate);
      case DatePickerMode.Date:
        return getFormattedDateString(selectedDate);
      default:
        return '';
    }
  };

  return (
    <>
      <TouchInput
        label={label}
        value={getFormattedDateString()}
        onPress={toggleModal}
        {...props}
      />
      <DatePickerBottomSheet
        initialDate={selectedDate}
        mode={mode}
        isVisible={isModalVisible}
        close={toggleModal}
        onChange={onChangeHandler}
      />
    </>
  );
};

const getStyles = (theme, screenHeight) =>
  StyleSheet.create({
    container: {
      height: screenHeight * 0.3,
      backgroundColor: 'white',
      borderRadius: 15,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      padding: theme.spacing.lg,
    },
  });

export default DatePickerInput;
