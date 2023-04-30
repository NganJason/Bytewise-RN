import { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '@rneui/themed';

import BaseText from '../Text/BaseText';
import IconButton from '../Touch/IconButton';

import { moveMonth } from '../../_shared/util/date';
import { MONTHS } from '../../_shared/constant/constant';

const DateNavigator = ({
  startingDate = new Date(),
  onForward = function () {},
  onBackward = function () {},
  month = true,
  year = false,
}) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  const [date, setDate] = useState(startingDate);

  const renderDate = () => {
    if (year) {
      return `${date.getFullYear()}`;
    }

    const monthStr = MONTHS[date.getMonth()];
    return `${monthStr} ${date.getFullYear()}`;
  };

  const moveForward = () => {
    let newDate;
    if (year) {
      newDate = moveMonth(date, 12);
    } else {
      newDate = moveMonth(date, 1);
    }

    setDate(newDate);
    onForward(newDate);
  };

  const moveBackward = () => {
    let newDate;
    if (year) {
      newDate = moveMonth(date, -12);
    } else {
      newDate = moveMonth(date, -1);
    }

    setDate(newDate);
    onBackward(newDate);
  };

  return (
    <View style={styles.container}>
      <IconButton
        iconName="chevron-left"
        type="entypo"
        onPress={moveBackward}
        color={theme.colors.grey2}
      />
      <BaseText h2 style={styles.date}>
        {renderDate()}
      </BaseText>
      <IconButton
        iconName="chevron-right"
        type="entypo"
        onPress={moveForward}
        color={theme.colors.grey2}
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
      color: theme.colors.primary,
      width: 100,
      textAlign: 'center',
    },
  });
