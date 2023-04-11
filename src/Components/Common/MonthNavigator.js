import { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '@rneui/themed';

import BaseText from '../Text/BaseText';
import IconButton from '../Touch/IconButton';

import { moveMonth } from '../../_shared/util/util';
import { MONTHS } from '../../_shared/constant/constant';

const MonthNavigator = ({
  startingDate = new Date(),
  onForward = function () {},
  onBackward = function () {},
}) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  const [date, setDate] = useState(startingDate);

  const renderDate = () => {
    const month = MONTHS[date.getMonth()];
    return `${month} ${date.getFullYear()}`;
  };

  const moveOneMonthForward = () => {
    const newDate = moveMonth(date, 1);
    setDate(newDate);
    onForward(newDate);
  };

  const moveOneMonthBackward = () => {
    const newDate = moveMonth(date, -1);
    setDate(newDate);
    onBackward(newDate);
  };

  return (
    <View style={styles.container}>
      <IconButton
        iconName="chevron-left"
        type="entypo"
        onPress={moveOneMonthBackward}
        color={theme.colors.grey2}
      />
      <BaseText h2 style={styles.date}>
        {renderDate()}
      </BaseText>
      <IconButton
        iconName="chevron-right"
        type="entypo"
        onPress={moveOneMonthForward}
        color={theme.colors.grey2}
      />
    </View>
  );
};

export default MonthNavigator;

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
