import { StyleSheet } from 'react-native';
import { useTheme } from '@rneui/themed';
import { Text } from '@rneui/themed';

const BaseText = ({
  h1 = false,
  h2 = false,
  h3 = false,
  h4 = false,
  text1 = false,
  text2 = false,
  text3 = false,
  text4 = false,
  text5 = false,
  btn1 = false,
  btn2 = false,
  btn3 = false,
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
        return theme.fontStyles.h1;
      case h2:
        return theme.fontStyles.h2;
      case h3:
        return theme.fontStyles.h3;
      case h4:
        return theme.fontStyles.h4;

      case text1:
        return theme.fontStyles.text1;
      case text2:
        return theme.fontStyles.text2;
      case text3:
        return theme.fontStyles.text3;
      case text4:
        return theme.fontStyles.text4;
      case text5:
        return theme.fontStyles.text5;

      case btn1:
        return styles.btn1Style;
      case btn2:
        return styles.btn2Style;
      case btn3:
        return styles.btn3Style;

      default:
        return theme.fontStyles.text3;
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
    center: {
      width: '100%',
      textAlign: 'center',
    },
  });
