import { Button, useTheme } from '@rneui/themed';
import { StyleSheet } from 'react-native';

import { BaseText } from '../Text';

const BaseButton = ({
  type = 'solid',
  title = '',
  loading = false,
  disabled = false,
  width = 0,
  fullWidth = false,
  align = 'center',
  marginVertical = 0,
  size = 'md',
  activeOpacity = 0.3,
  icon = null,
  onPress = function () {},
  buttonStyle = {},
  containerStyle = {},
}) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  const getButtonWidth = () => {
    switch (true) {
      case width !== 0:
        return width;
      case fullWidth:
        return '100%';
      default:
        return 'auto';
    }
  };

  const getBtnTextStyle = () => {
    switch (type) {
      case 'solid':
        return disabled
          ? styles.disabledSolidButtonTextStyle
          : styles.buttonSolidTextStyle;
      case 'outline':
        return disabled
          ? styles.disabledButtonOutlineTextStyle
          : styles.buttonOutlineTextStyle;
      default:
        return disabled
          ? styles.disabledSolidButtonTextStyle
          : styles.buttonSolidTextStyle;
    }
  };

  const getBtnStyle = () => {
    switch (type) {
      case 'outline':
        return !disabled && styles.buttonOutlineStyle;
    }
  };

  const getBtnDisabledStyle = () => {
    switch (type) {
      case 'solid':
        return styles.buttonSolidDisabledStyle;
      case 'outline':
        return styles.buttonOutlineDisabledStyle;
    }
  };

  return (
    <Button
      activeOpacity={activeOpacity}
      type={type}
      loading={loading}
      disabled={disabled}
      disabledStyle={getBtnDisabledStyle()}
      buttonStyle={{
        ...styles.buttonDefaultStyle,
        ...getBtnStyle(),
        ...buttonStyle,
      }}
      containerStyle={{
        width: getButtonWidth(),
        alignSelf: align,
        marginVertical: marginVertical,
        ...containerStyle,
      }}
      size={size}
      onPress={onPress}>
      {icon !== null && icon}
      <BaseText h3 style={getBtnTextStyle()}>
        {title}
      </BaseText>
    </Button>
  );
};

export default BaseButton;

const getStyles = theme =>
  StyleSheet.create({
    buttonDefaultStyle: {
      borderRadius: 10,
    },
    buttonSolidDisabledStyle: {
      backgroundColor: theme.colors.color5,
      opacity: 0.6,
    },
    buttonOutlineDisabledStyle: {
      backgroundColor: theme.colors.white,
      opacity: 0.6,
      borderWidth: 0.6,
    },
    buttonSolidTextStyle: {
      color: theme.colors.white,
    },
    disabledButtonSolidTextStyle: {
      color: theme.colors.color4,
    },
    buttonOutlineTextStyle: {
      color: theme.colors.color1,
    },
    disabledButtonOutlineTextStyle: {
      color: theme.colors.color4,
    },
    buttonOutlineStyle: {
      borderWidth: 0.6,
    },
  });
