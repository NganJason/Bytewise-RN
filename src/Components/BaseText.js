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
  adjustsFontSizeToFit = false,
  numberOfLines = 0,
  ellipsizeMode = 'tail',
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
      adjustsFontSizeToFit={adjustsFontSizeToFit}
      numberOfLines={numberOfLines}
      ellipsizeMode={ellipsizeMode}
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
    h1Style: theme.fontStyles.h1,
    h2Style: theme.fontStyles.h2,
    h3Style: theme.fontStyles.h3,
    h4Style: theme.fontStyles.h4,
    pStyle: theme.fontStyles.p,
    captionStyle: theme.fontStyles.caption,
  });
