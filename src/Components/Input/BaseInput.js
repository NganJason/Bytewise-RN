import { useState, forwardRef } from 'react';
import { useTheme, Input } from '@rneui/themed';
import { StyleSheet } from 'react-native';

import BaseText from '../Text/BaseText';

const BaseInput = forwardRef(
  (
    {
      label = '',
      value = '',
      placeholder = '',
      keyboardType = 'default',
      readOnly = false,
      showSoftInputOnFocus = true,
      leftIcon = null,
      rightIcon = null,
      autoFocus = false,
      caretHidden = false,
      onChangeText = function () {},
      onBlur = function () {},
      onFocus = function () {},
      containerStyle = {},
      clearButtonMode = 'never', // IOS only
      pointerEvents = 'auto',
      maxLength = null,
    },
    ref,
  ) => {
    const { theme } = useTheme();
    const styles = getStyles(theme);

    const [isFocused, setIsFocused] = useState(false);

    const handleBlur = () => {
      setIsFocused(false);
      onBlur();
    };

    const handleFocus = () => {
      setIsFocused(true);
      onFocus();
    };

    return (
      <Input
        ref={ref}
        keyboardType={keyboardType}
        onChangeText={onChangeText}
        onBlur={handleBlur}
        placeholder={placeholder}
        label={label !== '' && <BaseText h3>{label}</BaseText>}
        value={value}
        selectionColor={theme.colors.primary}
        onFocus={handleFocus}
        inputContainerStyle={[
          styles.inputContainer,
          isFocused ? styles.focused : styles.blur,
        ]}
        caretHidden={caretHidden}
        readOnly={readOnly}
        showSoftInputOnFocus={showSoftInputOnFocus}
        leftIcon={leftIcon !== null && leftIcon}
        rightIcon={rightIcon !== null && rightIcon}
        autoFocus={autoFocus}
        containerStyle={{ ...styles.container, ...containerStyle }}
        clearButtonMode={clearButtonMode}
        inputStyle={styles.input}
        pointerEvents={pointerEvents}
        renderErrorMessage={false}
        maxLength={maxLength}
      />
    );
  },
);

export default BaseInput;

const getStyles = theme =>
  StyleSheet.create({
    focused: {
      borderBottomColor: theme.colors.primary,
      borderBottomWidth: 1,
    },
    blur: {
      borderBottomColor: theme.colors.color5,
      borderBottomWidth: 1,
    },
    input: {
      ...theme.fontStyles.h4,
    },
    container: {
      paddingHorizontal: 0,
      marginBottom: 28,
    },
    inputContainer: {
      paddingVertical: 6,
      paddingHorizontal: 4,
    },
  });
