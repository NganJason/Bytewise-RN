import { StyleSheet } from 'react-native';
import { useTheme } from '@rneui/themed';
import { Text } from '@rneui/themed';

const BaseText = ({
  h1 = false,
  h2 = false,
  h3 = false,
  h4 = false,
  p = true,
  caption = false,
  children = '',
  style = {},
}) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  const getTextCommonStyles = () => {
    switch (true) {
      case h1:
        return styles.h1Style;
      case h2:
        return styles.h2Style;
      case h3:
        return styles.h3Style;
      case h4:
        return styles.h4Style;
      case caption:
        return styles.captionStyle;
      case p:
        return styles.pStyle;
    }
  };

  const commonTextStyles = getTextCommonStyles();

  return (
    <Text
      style={{
        ...commonTextStyles,
        ...style,
      }}
      h1Style={{ ...commonTextStyles, ...style }}
      h2Style={{ ...commonTextStyles, ...style }}
      h3Style={{ ...commonTextStyles, ...style }}
      h4Style={{ ...commonTextStyles, ...style }}
      h1={h1}
      h2={h2}
      h3={h3}
      h4={h4}>
      {children}
    </Text>
  );
};

export default BaseText;

const getStyles = theme =>
  StyleSheet.create({
    h1Style: {
      fontFamily: theme.fontFamily.medium,
      fontSize: theme.fontSizes.h1,
      color: theme.colors.black,
    },
    h2Style: {
      fontFamily: theme.fontFamily.medium,
      fontSize: theme.fontSizes.h2,
      color: theme.colors.black,
    },
    h3Style: {
      fontFamily: theme.fontFamily.regular,
      fontSize: theme.fontSizes.h3,
      color: theme.colors.black,
    },
    h4Style: {
      fontFamily: theme.fontFamily.regular,
      fontSize: theme.fontSizes.h4,
      color: theme.colors.black,
    },
    pStyle: {
      fontFamily: theme.fontFamily.regular,
      fontSize: theme.fontSizes.body,
      color: theme.colors.black,
    },
    captionStyle: {
      fontSize: theme.fontSizes.caption,
      color: theme.colors.grey2,
    },
  });
