import React from 'react';
import { StyleSheet } from 'react-native';
import { useTheme } from '@rneui/themed';
import Toast, { ErrorToast, SuccessToast } from 'react-native-toast-message';
import { capitalizeFirstWord } from '../../_shared/util';

const BaseSuccessToast = props => {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const { text1 = '', text2 = '' } = props;

  return (
    <SuccessToast
      {...props}
      text1={capitalizeFirstWord(text1)}
      text2={capitalizeFirstWord(text2)}
      text1Style={styles.text1}
      text2Style={styles.text2}
      style={styles.successToast}
    />
  );
};

const BaseErrorToast = props => {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const { text1 = '', text2 = '' } = props;

  return (
    <ErrorToast
      {...props}
      text1={capitalizeFirstWord(text1)}
      text2={capitalizeFirstWord(text2)}
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

BaseToast.show = opt => {
  Toast.show(opt);
};

const getStyles = theme =>
  StyleSheet.create({
    text1: {
      ...theme.fontStyles.text3,
    },
    text2: {
      ...theme.fontStyles.text4,
    },
    errorToast: {
      borderLeftColor: theme.colors.error,
    },
    successToast: {
      borderLeftColor: theme.colors.success,
    },
  });

export default BaseToast;
