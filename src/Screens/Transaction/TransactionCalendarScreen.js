import { StyleSheet, View } from 'react-native';
import {
  BaseCalendar,
  BaseScreen,
  BaseText,
  DateNavigator,
} from '../../Components';
import { useTheme } from '@rneui/themed';
import { useState } from 'react';
import { getFormattedDateString } from '../../_shared/util';
import { useDimension } from '../../_shared/hooks';

const TransactionCalendarScreen = () => {
  const { theme } = useTheme();
  const { screenHeight } = useDimension();
  const styles = getStyles(theme, screenHeight);
  const [currMonth, setCurrMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(getFormattedDateString());

  const onCurrMonthMove = e => {
    setCurrMonth(e);
  };

  const onDatePress = e => {
    setSelectedDate(e.dateString);
  };

  return (
    <BaseScreen
      allowLoadable={false}
      enablePadding={false}
      headerProps={{
        allowBack: true,
        centerComponent: (
          <DateNavigator
            date={currMonth}
            onForward={onCurrMonthMove}
            onBackward={onCurrMonthMove}
          />
        ),
      }}>
      <View style={styles.screen}>
        <BaseCalendar
          currMonthStr={getFormattedDateString(currMonth)}
          selectedDate={selectedDate}
          onDayPress={onDatePress}
          dayTextContainerStyle={styles.dayTextContainer}
          dayExtraInfo={
            <>
              <BaseText
                text6
                margin={{ top: 6 }}
                color={theme.colors.regularRed}>
                100
              </BaseText>
              <BaseText text6 color={theme.colors.color1}>
                200
              </BaseText>
            </>
          }
        />
      </View>
    </BaseScreen>
  );
};

const getStyles = theme => {
  return StyleSheet.create({
    dayTextContainer: {
      marginVertical: -6,
    },
  });
};

export default TransactionCalendarScreen;
