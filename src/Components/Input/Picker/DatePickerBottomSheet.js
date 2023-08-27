import { BottomSheet, useTheme } from '@rneui/themed';
import { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useDimension } from '../../../_shared/hooks';
import { BaseButton } from '../../Touch';
import DatePicker, { DatePickerMode } from './DatePicker';

const DatePickerBottomSheet = ({
  initialDate = new Date(),
  mode = DatePickerMode.Year,
  isVisible = false,
  close = function () {},
  onChange = function (e) {},
}) => {
  const { theme } = useTheme();
  const { screenHeight } = useDimension();
  const styles = getStyles(theme, screenHeight);

  const [selectedDate, setSelectedDate] = useState(initialDate);

  const onDone = () => {
    onChange(selectedDate);
    close();
  };

  const onDateChange = e => {
    setSelectedDate(e);
  };

  return (
    <BottomSheet
      fullScreen={true}
      scrollViewProps={{ style: { maxHeight: screenHeight / 2 } }}
      isVisible={isVisible}
      onBackdropPress={close}>
      <View style={styles.container}>
        <View style={styles.header}>
          <BaseButton
            title="Cancel"
            type="clear"
            align="flex-end"
            size="md"
            onPress={close}
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
          startingDate={initialDate}
          onChange={onDateChange}
        />
      </View>
    </BottomSheet>
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

export default DatePickerBottomSheet;
