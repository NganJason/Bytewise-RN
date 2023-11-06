import { View, StyleSheet } from 'react-native';
import { useTheme } from '@rneui/themed';

import BaseText from '../Text/BaseText';
import IconButton from '../Touch/IconButton';

import { moveMonth, getYear, getMonth } from '../../_shared/util';
import { MONTHS } from '../../_shared/constant/constant';
import DatePickerBottomSheet from '../Input/Picker/DatePickerBottomSheet';
import { DatePickerMode } from '../Input/Picker/DatePicker';
import { useState } from 'react';
import { TouchableOpacity } from 'react-native-gesture-handler';

const DateNavigator = ({
  date = new Date(),
  onForward = function () {},
  onBackward = function () {},
  isYear = false,
  enablePicker = false,
}) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
  const toggleDatePicker = () => {
    setIsDatePickerVisible(!isDatePickerVisible);
  };

  const onDatePickerChange = e => {
    onForward(e);
  };

  const renderDate = () => {
    if (isYear) {
      return `${getYear(date)}`;
    }

    const monthStr = MONTHS[getMonth(date)];
    return `${monthStr} ${getYear(date)}`;
  };

  const moveForward = () => {
    let newDate;
    if (isYear) {
      newDate = moveMonth(date, 12);
    } else {
      newDate = moveMonth(date, 1);
    }
    onForward(newDate);
  };

  const moveBackward = () => {
    let newDate;
    if (isYear) {
      newDate = moveMonth(date, -12);
    } else {
      newDate = moveMonth(date, -1);
    }
    onBackward(newDate);
  };

  return (
    <View style={styles.container}>
      <IconButton
        iconName="chevron-left"
        type="entypo"
        onPress={moveBackward}
        color={theme.colors.color8}
      />
      <TouchableOpacity onPress={toggleDatePicker} disabled={!enablePicker}>
        <BaseText h3 style={styles.date}>
          {renderDate()}
        </BaseText>
      </TouchableOpacity>
      <IconButton
        iconName="chevron-right"
        type="entypo"
        onPress={moveForward}
        color={theme.colors.color8}
      />
      <DatePickerBottomSheet
        mode={isYear ? DatePickerMode.Year : DatePickerMode.YearMonth}
        initialDate={date}
        isVisible={isDatePickerVisible}
        close={toggleDatePicker}
        onChange={onDatePickerChange}
      />
    </View>
  );
};

export default DateNavigator;

const getStyles = theme =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    date: {
      color: theme.colors.color6,
      width: 100,
      textAlign: 'center',
    },
  });
