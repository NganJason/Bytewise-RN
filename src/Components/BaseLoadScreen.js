import React from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import { useTheme } from '@rneui/themed';

const BaseLoadScreen = ({ isLoading = false, children }) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  return isLoading ? (
    <React.Fragment>
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="small" />
      </View>
    </React.Fragment>
  ) : (
    <React.Fragment>{children}</React.Fragment>
  );
};

const getStyles = theme =>
  StyleSheet.create({
    loadingContainer: {
      marginVertical: '50%',
    },
  });

export default BaseLoadScreen;
