import { useState, forwardRef } from 'react';
import { useTheme, Input } from '@rneui/themed';
import { StyleSheet, View } from 'react-native';

import BaseText from '../Text/BaseText';
import { InfoToolTip } from '../Common';

const BaseInput = forwardRef(
  (
    {
      label = '',
      tooltip = {
        title: '',
        message: '',
        customChildren: null,
      },
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
      onPressIn = function () {},
      containerStyle = {},
      labelStyle = {},
      clearButtonMode = 'never', // IOS only
      pointerEvents = 'auto',
      maxLength = null,
      secureTextEntry = false,
      errorMessage = '',
      disabled = false,
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

    const showToolTip = () => {
      if (
        (tooltip.title === '',
        tooltip.message === '',
        tooltip.customChildren === null)
      ) {
        return false;
      }

      return true;
    };

    return (
      <Input
        ref={ref}
        autoCapitalize="none"
        keyboardType={keyboardType}
        onChangeText={onChangeText}
        onBlur={handleBlur}
        placeholder={placeholder}
        onPressIn={onPressIn}
        label={
          label !== '' && (
            <View style={styles.label}>
              <BaseText h4 style={labelStyle} margin={{ right: 6 }}>
                {label}
              </BaseText>
              {showToolTip() && (
                <InfoToolTip
                  title={tooltip.title}
                  message={tooltip.message}
                  customChildren={tooltip.customChildren}
                />
              )}
            </View>
          )
        }
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
        inputStyle={[styles.input, disabled && styles.inputDisabled]}
        pointerEvents={pointerEvents}
        renderErrorMessage={true}
        maxLength={maxLength}
        secureTextEntry={secureTextEntry}
        errorMessage={errorMessage}
      />
    );
  },
);

export default BaseInput;

const getStyles = theme =>
  StyleSheet.create({
    focused: {
      borderBottomColor: theme.colors.color1,
      borderBottomWidth: 1,
    },
    blur: {
      borderBottomColor: theme.colors.color8,
      borderBottomWidth: 1,
    },
    label: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    input: {
      ...theme.fontStyles.text2,
      color: theme.colors.color6,
    },
    inputDisabled: {
      color: theme.colors.color8,
    },
    container: {
      paddingHorizontal: 0,
      marginBottom: 16,
    },
    inputContainer: {
      paddingVertical: 4,
      paddingHorizontal: 2,
    },
  });
