import { ScrollView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import HideKeyboard from './HideKeyboard';

import { StyleSheet } from 'react-native';
import { useTheme } from '@rneui/themed';

const BaseScreen = ({ children, fab, style }) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  return (
    <HideKeyboard>
      <SafeAreaView>
        <ScrollView style={{ ...styles.scrollView, ...style }}>
          {children}
        </ScrollView>
        {fab}
      </SafeAreaView>
    </HideKeyboard>
  );
};

const getStyles = theme =>
  StyleSheet.create({
    scrollView: {
      flexGrow: 1,
      minHeight: '100%',
    },
  });

export default BaseScreen;
