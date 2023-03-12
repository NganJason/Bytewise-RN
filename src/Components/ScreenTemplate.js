import { StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { useTheme } from '@rneui/themed';

function ScreenTemplate(props) {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  return (
    <SafeAreaProvider style={styles.container} {...props}>
      {props.children}
    </SafeAreaProvider>
  );
}

const getStyles = theme =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.colors.background,
    },
  });

export default ScreenTemplate;
