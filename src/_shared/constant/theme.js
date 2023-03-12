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
  red0: '#B85050',
  disabled: '#E3E6E8',
  error: '#F41A0F',
  success: '#52C41A',
  warning: '#F8AD16',
};

const FONTS = {
  ZenKakuGothicNewBlack: 'ZenKakuGothicNewBlack',
  ZenKakuGothicNewBold: 'ZenKakuGothicNewBold',
  ZenKakuGothicNewLight: 'ZenKakuGothicNewLight',
  ZenKakuGothicNewMedium: 'ZenKakuGothicNewMedium',
  ZenKakuGothicNewRegular: 'ZenKakuGothicNewRegular',
};

const FONT_SIZES = {
  h1: 32,
  h2: 28,
  h3: 24,
  h4: 20,
  body: 16,
  caption: 12,
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
    red0: COLORS.red0,
    white: COLORS.white,
    black: COLORS.black,
  },
  fontFamily: {
    bold: FONTS.ZenKakuGothicNewBlack,
    semiBold: FONTS.ZenKakuGothicNewBold,
    light: FONTS.ZenKakuGothicNewLight,
    medium: FONTS.ZenKakuGothicNewMedium,
    regular: FONTS.ZenKakuGothicNewRegular,
  },
  fontSizes: {
    h1: FONT_SIZES.h1,
    h2: FONT_SIZES.h2,
    h3: FONT_SIZES.h3,
    h4: FONT_SIZES.h4,
    body: FONT_SIZES.body,
    caption: FONT_SIZES.caption,
  },
});
