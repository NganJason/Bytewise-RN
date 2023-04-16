import React from 'react';
import { StyleSheet } from 'react-native';
import { useTheme } from '@rneui/themed';
import Toast, { ErrorToast, SuccessToast } from 'react-native-toast-message';

const BaseSuccessToast = props => {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  return (
    <SuccessToast
      {...props}
      text1Style={styles.text1}
      text2Style={styles.text2}
      style={styles.successToast}
    />
  );
};

const BaseErrorToast = props => {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  return (
    <ErrorToast
      {...props}
      text1Style={styles.text1}
      text2Style={styles.text2}
      style={styles.errorToast}
    />
  );
};

const BaseToast = () => {
  const toastTheme = {
    error: BaseErrorToast,
    success: BaseSuccessToast,
  };

  return <Toast config={toastTheme} />;
};

BaseToast.show = opt => Toast.show(opt);

const getStyles = theme =>
  StyleSheet.create({
    text1: {
      ...theme.fontStyles.h4,
    },
    text2: {
      ...theme.fontStyles.p,
    },
    errorToast: {
      borderLeftColor: theme.colors.error,
    },
    successToast: {
      borderLeftColor: theme.colors.success,
    },
  });

export default BaseToast;
