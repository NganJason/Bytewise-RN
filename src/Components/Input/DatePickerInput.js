import { BottomSheet, useTheme } from '@rneui/themed';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import useDimension from '../../_shared/hooks/dimension';
import { getYearMonthString, getYearString } from '../../_shared/util/date';
import { BaseButton } from '../Touch';
import DatePicker, { DatePickerMode } from './Picker/DatePicker';
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

  const getDateString = () => {
    switch (mode) {
      case DatePickerMode.Year:
        return getYearString(selectedDate);
      case DatePickerMode.YearMonth:
        return getYearMonthString(selectedDate);
      case DatePickerMode.Date:
        return getDateString(selectedDate);
      default:
        return '';
    }
  };

  return (
    <>
      <TouchInput
        label={label}
        value={getDateString()}
        onPress={toggleModal}
        {...props}
      />
      <BottomSheet
        fullScreen={true}
        scrollViewProps={{ style: { maxHeight: screenHeight / 2 } }}
        isVisible={isModalVisible}
        onBackdropPress={toggleModal}>
        <View style={styles.container}>
          <View style={styles.header}>
            <BaseButton
              title="Cancel"
              type="clear"
              align="flex-end"
              size="md"
              onPress={onCancel}
            />
            <BaseButton
              title="Done"
              type="clear"
              align="flex-end"
              size="md"
              onPress={onDone}
            />
          </View>
          <DatePicker
            mode={mode}
            startingDate={selectedDate}
            onChange={onChangeHandler}
          />
        </View>
      </BottomSheet>
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
