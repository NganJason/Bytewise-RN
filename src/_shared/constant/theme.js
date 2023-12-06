import { createTheme } from '@rneui/themed';
import { DefaultTheme } from '@react-navigation/native';
import { LocaleConfig } from 'react-native-calendars';

const COLORS = {
  green: '#00754A',
  mediumGreen: '#2BCD73',
  regularGreen: '#D8FBDD',
  lightGreen: '#EEFAFA',
  darkGreen: '#18473F',

  black: '#1D1A1B',
  mediumGrey: '#575757',
  regularGrey: '#A0A0A0',
  lightGrey: '#E5E3E3',

  brown: '#6B2201',
  lightBrown: '#FAF6F5',

  darkBlue: '#162B3F',
  veryLightBlue: '#F3F7FB',

  lightPurple: '#F3F7FB',

  brightRed: '#B31312',
  regularRed: '#B85050',
  lightRed: '#EA6F7C',
  white: '#FFFFFF',

  disabled: '#E3E6E8',
  error: '#F41A0F',
  success: '#52C41A',
  warning: '#F8AD16',
};

const FONT_SIZES = {
  h1: 28,
  h2: 22,
  h3: 20,
  h4: 18,
  h5: 17,
  h6: 15,
  h7: 13,
  h8: 11,
  h9: 9,
};

const FONT_FAMILY = {
  bold: 'InterBold',
  semiBold: 'InterSemiBold',
  medium: 'InterMedium',
  regular: 'InterRegular',
  light: 'InterLight',
};

export const THEME = createTheme({
  colors: {
    ...DefaultTheme.colors,
    background: COLORS.white,
    text: COLORS.black,
    primary: COLORS.green,
    secondary: COLORS.mediumGreen,

    color1: COLORS.green,
    color2: COLORS.mediumGreen,
    color3: COLORS.regularGreen,
    color4: COLORS.lightGreen,
    color5: COLORS.darkGreen,

    color6: COLORS.black,
    color7: COLORS.mediumGrey,
    color8: COLORS.regularGrey,
    color9: COLORS.lightGrey,

    color10: COLORS.darkBlue,
    color11: COLORS.veryLightBlue,

    color12: COLORS.brown,
    color13: COLORS.lightBrown,
    color14: COLORS.lightPurple,

    brightRed: COLORS.brightRed,
    regularRed: COLORS.regularRed,
    lightRed: COLORS.lightRed,
    white: COLORS.white,
    black: COLORS.black,

    error: COLORS.error,
    success: COLORS.success,
    warning: COLORS.warning,
    inactive: COLORS.color6,
  },
  fontFamily: {
    bold: FONT_FAMILY.bold,
    semiBold: FONT_FAMILY.semiBold,
    medium: FONT_FAMILY.medium,
    regular: FONT_FAMILY.regular,
    light: FONT_FAMILY.light,
  },
  fontStyles: {
    // Header
    h1: {
      fontFamily: FONT_FAMILY.semiBold,
      fontSize: FONT_SIZES.h1,
      color: COLORS.black,
    },
    h2: {
      fontFamily: FONT_FAMILY.semiBold,
      fontSize: FONT_SIZES.h2,
      color: COLORS.black,
    },
    h3: {
      fontFamily: FONT_FAMILY.semiBold,
      fontSize: FONT_SIZES.h3,
      color: COLORS.black,
    },
    h4: {
      fontFamily: FONT_FAMILY.medium,
      fontSize: FONT_SIZES.h4,
      color: COLORS.black,
    },

    // Text
    text1: {
      fontFamily: FONT_FAMILY.semiBold,
      fontSize: FONT_SIZES.h4,
      color: COLORS.black,
    },
    text2: {
      fontFamily: FONT_FAMILY.medium,
      fontSize: FONT_SIZES.h5,
      color: COLORS.black,
    },
    text3: {
      fontFamily: FONT_FAMILY.medium,
      fontSize: FONT_SIZES.h6,
      color: COLORS.black,
    },
    text4: {
      fontFamily: FONT_FAMILY.semiBold,
      fontSize: FONT_SIZES.h7,
      color: COLORS.black,
    },
    text5: {
      fontFamily: FONT_FAMILY.medium,
      fontSize: FONT_SIZES.h7,
      color: COLORS.black,
    },
    text6: {
      fontFamily: FONT_FAMILY.medium,
      fontSize: FONT_SIZES.h8,
      color: COLORS.black,
    },
    text7: {
      fontFamily: FONT_FAMILY.medium,
      fontSize: FONT_SIZES.h9,
      color: COLORS.black,
    },

    // Button
    btn1: {
      fontFamily: FONT_FAMILY.semiBold,
      fontSize: FONT_SIZES.h4,
      color: COLORS.black,
    },
    btn2: {
      fontFamily: FONT_FAMILY.semiBold,
      fontSize: FONT_SIZES.h5,
      color: COLORS.black,
    },
    btn3: {
      fontFamily: FONT_FAMILY.semiBold,
      fontSize: FONT_SIZES.h6,
      color: COLORS.black,
    },
    linkText: {
      color: COLORS.green,
      textDecorationLine: 'underline',
    },
  },
  borderBottom: {
    borderColor: COLORS.regularGrey,
    borderBottomWidth: 0.4,
  },
  spacing: {
    xl: 24,
    lg: 12,
    md: 8,
    sm: 4,
    xs: 2,
  },
  calendar: {
    'stylesheet.calendar.header': {
      week: {
        marginBottom: 0,
        flexDirection: 'row',
        justifyContent: 'space-around',
      },
      dayHeader: {
        width: 28,
        height: 28,
        textAlign: 'center',
      },
    },
    'stylesheet.calendar.main': {
      week: {
        marginVertical: 0,
        flexDirection: 'row',
        justifyContent: 'space-around',
      },
    },
    monthTextColor: COLORS.black,
    arrowColor: COLORS.regularGrey,
    calendarBackground: undefined, // To make it transparent

    textDayHeaderFontSize: 12,
    textDayHeaderFontFamily: FONT_FAMILY.semiBold,
    textSectionTitleColor: COLORS.mediumGrey,

    textDayFontSize: FONT_SIZES.h7,
    textDayFontFamily: FONT_FAMILY.semiBold,
    dayTextColor: COLORS.black,
    todayTextColor: COLORS.black,
    selectedDayTextColor: COLORS.green,
    selectedDayBackgroundColor: COLORS.regularGreen,

    textMonthFontSize: FONT_SIZES.h5,
    textMonthFontFamily: FONT_FAMILY.medium,

    textDisabledColor: '#d9e1e8',
    dotColor: 'red',
  },
});

LocaleConfig.locales['.'] = {
  monthNames: [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ],
  monthNamesShort: [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ],
  dayNames: ['Sun', 'Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat'],
  dayNamesShort: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
};

LocaleConfig.defaultLocale = '.';
