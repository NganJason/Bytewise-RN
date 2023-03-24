import { ScrollView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import HideKeyboard from './HideKeyboard';

import { View, StyleSheet } from 'react-native';
import { useTheme } from '@rneui/themed';

const BaseScreen = ({ children, fab, ...props }) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  return (
    <HideKeyboard>
      <SafeAreaProvider>
        <ScrollView style={styles.scrollView}>{children}</ScrollView>
        {fab}
      </SafeAreaProvider>
    </HideKeyboard>
  );
};

const getStyles = theme =>
  StyleSheet.create({
    scrollView: {
      flexGrow: 1,
    },
  });

export default BaseScreen;
