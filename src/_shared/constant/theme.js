import { createTheme } from '@rneui/themed';
import { DefaultTheme } from '@react-navigation/native';

const COLORS = {
  green: '#00754A',
  mediumGreen: '#00B749',
  regularGreen: '#D8FBDD',
  lightGreen: '#EEFAFA',
  darkGreen: '#18473F',

  black: '#1D1A1B',
  mediumGrey: '#575757',
  regularGrey: '#A0A0A0',
  lightGrey: '#E5E3E3',

  veryLightBlue: '#F3F7FB',

  red: '#CE3535',
  white: '#FFF',

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

    color10: COLORS.veryLightBlue,

    red: COLORS.red,
    white: COLORS.white,
    black: COLORS.black,

    error: COLORS.error,
    success: COLORS.success,
    warning: COLORS.warning,
    inactive: COLORS.color6,
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
});
