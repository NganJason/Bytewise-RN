import { StyleSheet } from 'react-native';
import { useTheme } from '@rneui/themed';
import { Text } from '@rneui/themed';

const BaseText = ({
  h1 = false,
  h2 = false,
  h3 = false,
  h4 = false,
  h5 = false,
  h6 = false,
  p = true,
  caption = false,
  children = '',
  adjustsFontSizeToFit = false,
  numberOfLines = 0,
  ellipsizeMode = 'tail',
  center = false,
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
      case h5:
        return styles.h5Style;
      case h6:
        return styles.h6Style;
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
        ...(center && styles.center),
        ...style,
      }}
      adjustsFontSizeToFit={adjustsFontSizeToFit}
      numberOfLines={numberOfLines}
      ellipsizeMode={ellipsizeMode}>
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
    h5Style: theme.fontStyles.h5,
    h6Style: theme.fontStyles.h6,
    pStyle: theme.fontStyles.p,
    captionStyle: theme.fontStyles.caption,
    center: {
      width: '100%',
      textAlign: 'center',
    },
  });
