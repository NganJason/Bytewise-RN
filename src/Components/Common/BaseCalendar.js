import { useTheme } from '@rneui/themed';
import { StyleSheet, View } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { getFormattedDateString } from '../../_shared/util';
import { BaseText } from '../Text';

const BaseCalendar = ({
  currMonthStr = getFormattedDateString(),
  selectedDate = getFormattedDateString(),
  onDayPress = function (date) {},
  dayExtraInfo = function (date) {},
  dayTextContainerStyle = {},
}) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  const isSelectedDate = date => {
    return date.dateString === selectedDate;
  };

  const renderDay = ({ date, state }) => {
    const getDayColor = () => {
      if (state === 'disabled') {
        return theme.colors.color9;
      }
      if (isSelectedDate(date)) {
        return theme.colors.color1;
      }
      return theme.colors.color6;
    };

    return (
      <View style={styles.dayContainer}>
        <TouchableOpacity
          style={[
            styles.dayTextContainer,
            isSelectedDate(date) && styles.selectedDay,
            dayTextContainerStyle,
          ]}
          onPress={() => onDayPress(date)}>
          <BaseText text3 color={getDayColor()}>
            {date.day}
          </BaseText>
        </TouchableOpacity>
        {dayExtraInfo(date)}
      </View>
    );
  };

  const renderHeader = () => {
    return <></>;
  };

  return (
    <Calendar
      key={currMonthStr}
      current={currMonthStr}
      theme={theme.calendar}
      hideArrows
      customHeaderTitle={renderHeader()}
      dayComponent={renderDay}
      hideExtraDays
    />
  );
};

const getStyles = theme => {
  return StyleSheet.create({
    dayContainer: {
      alignItems: 'center',
    },
    dayTextContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      width: 28,
      height: 28,
      borderRadius: 100,
    },
    selectedDay: {
      backgroundColor: theme.colors.color3,
    },
  });
};

export default BaseCalendar;
