import { createTheme } from '@rneui/themed';
import { DefaultTheme } from '@react-navigation/native';

const COLORS = {
  color1: '#00754A', // green
  color2: '#E4F2ED', // light green
  color3: '#255171', // blue
  color4: '#6D6D6D', // grey
  color5: '#B4B4B4', // light grey
  color6: '#C7D1D6', // extra light grey
  black: '#252525',
  red: '#800000',
  white: '#FFF',
  disabled: '#E3E6E8',
  error: '#F41A0F',
  success: '#52C41A',
  warning: '#F8AD16',
};

const FONT_SIZES = {
  h1: 22,
  h2: 20,
  h3: 18,
  h4: 16,
  h5: 13,
  h6: 10,
  body: 16,
  caption: 12,
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
    text: COLORS.grey4,
    primary: COLORS.color1,
    secondary: COLORS.color2,
    color1: COLORS.color1,
    color2: COLORS.color2,
    color3: COLORS.color3,
    color4: COLORS.color4,
    color5: COLORS.color5,
    color6: COLORS.color6,
    error: COLORS.error,
    success: COLORS.success,
    warning: COLORS.warning,
    inactive: COLORS.color5,
    red: COLORS.red,
    white: COLORS.white,
    black: COLORS.black,
  },
  fontFamily: FONT_FAMILY,
  fontStyles: {
    h1: {
      fontFamily: FONT_FAMILY.semiBold,
      fontSize: FONT_SIZES.h1,
      color: COLORS.color4,
    },
    h2: {
      fontFamily: FONT_FAMILY.semiBold,
      fontSize: FONT_SIZES.h2,
      color: COLORS.color4,
    },
    h3: {
      fontFamily: FONT_FAMILY.semiBold,
      fontSize: FONT_SIZES.h3,
      color: COLORS.color4,
    },
    h4: {
      fontFamily: FONT_FAMILY.medium,
      fontSize: FONT_SIZES.h4,
      color: COLORS.color4,
    },
    h5: {
      fontFamily: FONT_FAMILY.medium,
      fontSize: FONT_SIZES.h5,
      color: COLORS.color4,
    },
    h6: {
      fontFamily: FONT_FAMILY.medium,
      fontSize: FONT_SIZES.h6,
      color: COLORS.color4,
    },
    p: {
      fontFamily: FONT_FAMILY.regular,
      fontSize: FONT_SIZES.body,
      color: COLORS.color4,
    },
    caption: {
      fontFamily: FONT_FAMILY.regular,
      fontSize: FONT_SIZES.caption,
      color: COLORS.color4,
    },
  },
  button: {
    borderRadius: 10,
  },
  spacing: {
    xl: 24,
    lg: 12,
    md: 8,
    sm: 4,
    xs: 2,
  },
});
