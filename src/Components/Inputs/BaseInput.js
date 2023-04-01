import { useState, forwardRef } from 'react';
import { useTheme, Input } from '@rneui/themed';
import { StyleSheet } from 'react-native';

import BaseText from '../BaseText';

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
      onPress = function () {},
      clearButtonMode = 'never', // IOS only
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
        onPressOut={onPress}
        placeholder={placeholder}
        label={label !== '' && <BaseText h3>{label}</BaseText>}
        value={value}
        selectionColor={theme.colors.primary}
        onFocus={handleFocus}
        inputContainerStyle={isFocused ? styles.focused : styles.blur}
        caretHidden={caretHidden}
        readOnly={readOnly}
        showSoftInputOnFocus={showSoftInputOnFocus}
        leftIcon={leftIcon !== null && leftIcon}
        rightIcon={rightIcon !== null && rightIcon}
        autoFocus={autoFocus}
        containerStyle={{ marginBottom: theme.spacing.xs }}
        clearButtonMode={clearButtonMode}
      />
    );
  },
);

export default BaseInput;

const getStyles = theme =>
  StyleSheet.create({
    focused: {
      borderBottomColor: theme.colors.primary,
      borderBottomWidth: theme.spacing.xs,
    },
    blur: {
      borderBottomWidth: theme.spacing.xs,
    },
  });
