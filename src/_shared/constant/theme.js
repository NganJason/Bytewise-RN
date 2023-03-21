import { createTheme } from '@rneui/themed';
import { DefaultTheme } from '@react-navigation/native';

const COLORS = {
  primary: '#00754A',
  secondary: '#E4F2ED',
  black: '#252525',
  white: '#FFF',
  grey0: '#383E42',
  grey1: '#43484D',
  grey2: '#5E6977',
  grey3: '#86939E',
  grey4: '#bdc6cf',
  grey5: '#F2F2F2',
  grey6: '#6D6D6D',
  red0: '#B85050',
  disabled: '#E3E6E8',
  error: '#F41A0F',
  success: '#52C41A',
  warning: '#F8AD16',
};

const FONT_SIZES = {
  h1: 28,
  h2: 18,
  h3: 16,
  h4: 12,
  body: 16,
  caption: 12,
};

const FONT_FAMILY = {
  bold: 'ZenKakuGothicNewBlack',
  semiBold: 'ZenKakuGothicNewBold',
  medium: 'ZenKakuGothicNewMedium',
  regular: 'ZenKakuGothicNewRegular',
  light: 'ZenKakuGothicNewLight',
};

export const THEME = createTheme({
  colors: {
    ...DefaultTheme.colors,
    background: COLORS.white,
    text: COLORS.grey1,
    primary: COLORS.primary,
    secondary: COLORS.secondary,
    error: COLORS.error,
    success: COLORS.success,
    warning: COLORS.warning,
    inactive: COLORS.grey3,
    grey0: COLORS.grey0,
    grey1: COLORS.grey1,
    grey2: COLORS.grey2,
    grey3: COLORS.grey3,
    grey4: COLORS.grey4,
    grey5: COLORS.grey5,
    grey6: COLORS.grey6,
    red0: COLORS.red0,
    white: COLORS.white,
    black: COLORS.black,
  },
  fontFamily: FONT_FAMILY,
  fontSizes: FONT_SIZES,
  fontStyles: {
    h1: {
      fontFamily: FONT_FAMILY.bold,
      fontSize: FONT_SIZES.h1,
      color: COLORS.black,
    },
    h2: {
      fontFamily: FONT_FAMILY.semiBold,
      fontSize: FONT_SIZES.h2,
      color: COLORS.black,
    },
    h3: {
      fontFamily: FONT_FAMILY.medium,
      fontSize: FONT_SIZES.h3,
      color: COLORS.black,
    },
    h4: {
      fontFamily: FONT_FAMILY.regular,
      fontSize: FONT_SIZES.h4,
      color: COLORS.black,
    },
    p: {
      fontFamily: FONT_FAMILY.regular,
      fontSize: FONT_SIZES.body,
      color: COLORS.black,
    },
    caption: {
      fontFamily: FONT_FAMILY.regular,
      fontSize: FONT_SIZES.caption,
      color: COLORS.grey2,
    },
  },
  spacing: {
    lg: 12,
    md: 8,
    sm: 4,
    xl: 24,
    xs: 2,
  },
});
