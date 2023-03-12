import { StyleSheet, SafeAreaView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useTheme } from '@rneui/themed';

function ScreenTemplate(props) {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  return (
    <SafeAreaView style={styles.container} {...props}>
      <StatusBar />
      {props.children}
    </SafeAreaView>
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
