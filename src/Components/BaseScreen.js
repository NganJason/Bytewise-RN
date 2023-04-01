import { ScrollView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet } from 'react-native';
import { useTheme } from '@rneui/themed';

import HideKeyboard from './HideKeyboard';

const BaseScreen = ({ children, fab }) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  return (
    <HideKeyboard>
      <SafeAreaView>
        <ScrollView style={styles.scrollView}>{children}</ScrollView>
        {fab}
      </SafeAreaView>
    </HideKeyboard>
  );
};

const getStyles = theme =>
  StyleSheet.create({
    scrollView: {
      flexGrow: 1,
      padding: theme.spacing.xl,
      minHeight: '100%',
    },
  });

export default BaseScreen;
