import { useState, forwardRef } from 'react';
import { useTheme, Input } from '@rneui/themed';
import { StyleSheet, View } from 'react-native';

import BaseText from '../Text/BaseText';
import InfoToolTip from '../Common/InfoToolTip';

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
      longText = false,
      ...props
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

    const getFocusedStyle = () => {
      if (longText) {
        return isFocused && styles.longTextFocus;
      }
      return isFocused ? styles.focused : styles.blur;
    };

    const getInputContainerStyle = () => {
      if (longText) {
        return styles.longTextContainer;
      }
      return {};
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
          getInputContainerStyle(),
          getFocusedStyle(),
        ]}
        caretHidden={caretHidden}
        readOnly={readOnly}
        showSoftInputOnFocus={showSoftInputOnFocus}
        leftIcon={leftIcon !== null && leftIcon}
        rightIcon={rightIcon !== null && rightIcon}
        autoFocus={autoFocus}
        containerStyle={[styles.container, containerStyle]}
        clearButtonMode={clearButtonMode}
        inputStyle={[styles.input]}
        disabledInputStyle={styles.inputDisabled}
        pointerEvents={pointerEvents}
        renderErrorMessage={true}
        maxLength={maxLength}
        secureTextEntry={secureTextEntry}
        errorMessage={errorMessage}
        disabled={disabled}
        {...props}
      />
    );
  },
);

export default BaseInput;

const getStyles = theme =>
  StyleSheet.create({
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
    focused: {
      borderBottomColor: theme.colors.color1,
      borderBottomWidth: 1,
    },
    blur: {
      borderBottomColor: theme.colors.color8,
      borderBottomWidth: 1,
    },
    longTextContainer: {
      paddingHorizontal: 10,
      justifyContent: 'flex-start',
      alignItems: 'flex-start',
      borderColor: theme.colors.color8,
      borderWidth: 0.5,
      borderRadius: 8,
      height: 120,
    },
    longTextFocus: {
      borderColor: theme.colors.color1,
      borderWidth: 1,
    },
  });
