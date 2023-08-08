import { Button, useTheme } from '@rneui/themed';
import { StyleSheet, View } from 'react-native';

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
  textStyle = {},
  margin = { top: 0, bottom: 0, left: 0, right: 0, vertical: 0, horizontal: 0 },
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

  const getTextStyle = () => {
    switch (size) {
      case 'lg':
        return theme.fontStyles.btn1;
      case 'md':
        return theme.fontStyles.btn2;
      case 'sm':
        return theme.fontStyles.btn3;
      default:
        return theme.fontStyles.btn2;
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
          btn: styles.clearButtonStyle,
          disabled: styles.clearDisabledButtonStyle,
        };
      case 'secondary':
        return {
          title: disabled
            ? styles.secondaryButtonTextStyle
            : styles.secondaryButtonTextStyle,
          btn: styles.secondaryButtonStyle,
          disabled: styles.secondaryDisabledButtonStyle,
        };
      case 'tertiary':
        return {
          title: disabled
            ? styles.tertiaryButtonTextStyle
            : styles.tertiaryButtonTextStyle,
          btn: styles.tertiaryButtonStyle,
          disabled: styles.tertiaryDisabledButtonStyle,
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

  // top, bottom, left, right take precedence over vertical and horizontal
  const getMargin = () => {
    let m = {};
    if (margin.top !== undefined || margin.bottom !== undefined) {
      m.marginTop = margin.top;
      m.marginBottom = margin.bottom;
    } else {
      m.marginVertical = margin.vertical;
    }

    if (margin.left !== undefined || margin.right !== undefined) {
      m.marginLeft = margin.left;
      m.marginRight = margin.right;
    } else {
      m.marginHorizontal = margin.horizontal;
    }

    return m;
  };

  const buttonStyle = getButtonStyle();

  return (
    <Button
      activeOpacity={activeOpacity}
      type={type}
      loading={loading}
      disabled={disabled}
      disabledStyle={{
        ...styles.commonDisabledButtonStyle,
        ...buttonStyle.disabled,
      }}
      buttonStyle={{
        ...styles.commonButtonStyle,
        ...buttonStyle.btn,
      }}
      containerStyle={[
        getMargin(),
        {
          width: getContainerWidth(),
          alignSelf: align,
        },
      ]}
      titleStyle={{ ...getTextStyle(), ...buttonStyle.title, ...textStyle }}
      size={size}
      title={title}
      icon={icon !== null && <View style={styles.icon}>{icon}</View>}
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
      backgroundColor: theme.colors.color8,
    },
    solidDisabledButtonTextStyle: {
      color: theme.colors.regularRed,
    },
    solidButtonTextStyle: {
      color: theme.colors.white,
    },

    outlineDisabledButtonStyle: {
      backgroundColor: theme.colors.white,
    },
    outlineButtonTextStyle: {
      color: theme.colors.color1,
    },
    outlineDisabledButtonTextStyle: {
      color: theme.colors.regularRed,
    },

    clearButtonStyle: {
      paddingHorizontal: 0,
    },
    clearDisabledButtonStyle: {
      backgroundColor: theme.colors.white,
    },
    clearButtonTextStyle: {
      color: theme.colors.color1,
    },
    clearDisabledButtonTextStyle: {
      color: theme.colors.regularRed,
    },

    secondaryButtonStyle: {
      backgroundColor: theme.colors.color4,
      borderRadius: 15,
      paddingHorizontal: 12,
    },
    secondaryDisabledButtonStyle: {
      backgroundColor: theme.colors.color8,
    },
    secondaryButtonTextStyle: {
      color: theme.colors.color6,
      ...theme.fontStyles.text4,
    },

    tertiaryButtonStyle: {
      backgroundColor: theme.colors.color3,
      borderRadius: 15,
      paddingHorizontal: 12,
    },
    tertiaryDisabledButtonStyle: {
      backgroundColor: theme.colors.color3,
      borderRadius: 15,
      paddingHorizontal: 12,
    },
    tertiaryButtonTextStyle: {
      color: theme.colors.color1,
      ...theme.fontStyles.text4,
    },

    secondaryDisabledButtonTextStyle: {},

    icon: {
      marginRight: theme.spacing.sm,
    },
  });
