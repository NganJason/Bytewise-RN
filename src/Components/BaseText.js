import { StyleSheet } from 'react-native';
import { useTheme } from '@rneui/themed';
import { Text } from '@rneui/themed';

const BaseText = ({
  h1 = false,
  h2 = false,
  h3 = false,
  h4 = false,
  children = '',
  style = {},
}) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  return (
    <Text
      style={{
        fontFamily: theme.fontFamily.regular,
        fontSize: theme.fontSizes.body,
        ...style,
      }}
      h1Style={styles.h1Style}
      h2Style={styles.h2Style}
      h3Style={styles.h3Style}
      h4Style={styles.h4Style}
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
      fontFamily: theme.fontFamily.bold,
      fontSize: theme.fontSizes.h1,
    },
    h2Style: {
      fontFamily: theme.fontFamily.semiBold,
      fontSize: theme.fontSizes.h2,
    },
    h3Style: {
      fontFamily: theme.fontFamily.medium,
      fontSize: theme.fontSizes.h3,
    },
    h4Style: {
      fontFamily: theme.fontFamily.medium,
      fontSize: theme.fontSizes.h4,
    },
  });
