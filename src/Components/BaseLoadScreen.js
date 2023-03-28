import { StyleSheet, View, ActivityIndicator } from 'react-native';
import { useTheme } from '@rneui/themed';

const BaseLoadScreen = ({ isLoading, children }) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  return isLoading ? (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="small" />
    </View>
  ) : (
    <>{children}</>
  );
};

const getStyles = theme =>
  StyleSheet.create({
    loadingContainer: {
      marginVertical: '50%',
    },
  });

export default BaseLoadScreen;
