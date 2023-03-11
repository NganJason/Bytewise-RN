import { createTheme } from '@rneui/themed';
import { DefaultTheme } from '@react-navigation/native';

const COLORS = {
  primary: '#008248',
  black: '#252525',
  white: '#FFF',
  grey0: '#383E42',
  grey1: '#43484D',
  grey2: '#5E6977',
  grey3: '#86939E',
  grey4: '#bdc6cf',
  grey5: '#F2F2F2',
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

export const THEME = createTheme({
  colors: {
    ...DefaultTheme.colors,
    background: COLORS.grey5,
    text: COLORS.grey1,
    primary: COLORS.primary,
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
  },
  fontFamily: {
    bold: FONTS.ZenKakuGothicNewBlack,
    semiBold: FONTS.ZenKakuGothicNewBold,
    light: FONTS.ZenKakuGothicNewLight,
    medium: FONTS.ZenKakuGothicNewMedium,
    regular: FONTS.ZenKakuGothicNewRegular,
  },
});
