import { Button, useTheme } from '@rneui/themed';
import { StyleSheet } from 'react-native';

const BaseButton = ({
  type = 'solid',
  title = '',
  loading = false,
  disabled = false,
  width = 0,
  fullWidth = false,
  align = 'center',
  size = 'md',
  activeOpacity = 0.3,
  icon = null,
  onPress = function () {},
}) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  const getContainerWidth = () => {
    switch (true) {
      case width !== 0:
        return width;
      case fullWidth:
        return '100%';
      default:
        return 'auto';
    }
  };

  const getButtonStyle = () => {
    switch (type) {
      case 'outline':
        return {
          title: disabled
            ? styles.outlineDisabledButtonTextStyle
            : styles.outlineButtonTextStyle,
          btn: {},
          disabled: styles.outlineDisabledButtonStyle,
        };
      case 'clear':
        return {
          title: disabled
            ? styles.clearDisabledButtonTextStyle
            : styles.clearButtonTextStyle,
          btn: {},
          disabled: styles.clearDisabledButtonStyle,
        };
      default:
        return {
          title: disabled
            ? styles.solidDisabledButtonTextStyle
            : styles.solidButtonTextStyle,
          btn: {},
          disabled: styles.solidDisabledButtonStyle,
        };
    }
  };

  const buttonStyle = getButtonStyle();

  return (
    <Button
      activeOpacity={activeOpacity}
      type={type}
      loading={loading}
      disabled={disabled}
      disabledStyle={{
        ...theme.fontStyles.buttonText,
        ...styles.commonDisabledButtonStyle,
        ...buttonStyle.disabled,
      }}
      buttonStyle={{
        ...styles.commonButtonStyle,
        ...buttonStyle.btn,
      }}
      containerStyle={{
        width: getContainerWidth(),
        alignSelf: align,
      }}
      titleStyle={{ ...theme.fontStyles.buttonText, ...buttonStyle.title }}
      size={size}
      title={title}
      icon={icon !== null && icon}
      onPress={onPress}
    />
  );
};

export default BaseButton;

const getStyles = theme =>
  StyleSheet.create({
    commonButtonStyle: {
      borderRadius: 10,
    },
    commonDisabledButtonStyle: {
      opacity: 0.6,
    },
    solidDisabledButtonStyle: {
      backgroundColor: theme.colors.color5,
    },
    outlineDisabledButtonStyle: {
      backgroundColor: theme.colors.white,
    },
    clearDisabledButtonStyle: {
      backgroundColor: theme.colors.white,
    },
    solidButtonTextStyle: {
      color: theme.colors.white,
    },
    outlineButtonTextStyle: {
      color: theme.colors.color1,
    },
    clearButtonTextStyle: {
      color: theme.colors.color1,
    },
    solidDisabledButtonTextStyle: {
      color: theme.colors.color4,
    },
    outlineDisabledButtonTextStyle: {
      color: theme.colors.color4,
    },
    clearDisabledButtonTextStyle: {
      color: theme.colors.color4,
    },
  });
