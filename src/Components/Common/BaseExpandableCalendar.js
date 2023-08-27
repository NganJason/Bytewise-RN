import { StyleSheet, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { getFormattedDateString } from '../../_shared/util';
import { BaseText } from '../Text';

const { useTheme } = require('@rneui/themed');
const {
  CalendarProvider,
  ExpandableCalendar,
} = require('react-native-calendars');

// WIP: This component is not working for now
const BaseExpandableCalendar = ({
  currMonthStr = getFormattedDateString(),
  selectedDate = getFormattedDateString(),
  onDayPress = function (date) {},
  dayExtraInfo = <></>,
  dayTextContainerStyle = {},
}) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  const renderHeader = () => {
    return <></>;
  };

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
        {dayExtraInfo}
      </View>
    );
  };

  return (
    <CalendarProvider date={'2022-10-28'} theme={theme.calendar}>
      <ExpandableCalendar
        horizontal={true}
        hideArrows
        initialPosition={ExpandableCalendar.positions.OPEN}
        disableWeekScroll
        theme={theme.calendar}
        firstDay={1}
        markedDates={{}}
        closeOnDayPress={false}
        customHeaderTitle={renderHeader()}
        dayComponent={renderDay}
      />
    </CalendarProvider>
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
      shadowColor: theme.colors.black,
      shadowOffset: {},
      shadowOpacity: 0.2,
      shadowRadius: 2,
    },
    selectedDay: {
      backgroundColor: theme.colors.color3,
    },
  });
};

export default BaseExpandableCalendar;
