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

  return (
    <Button
      activeOpacity={activeOpacity}
      type={type}
      loading={loading}
      disabled={disabled}
      disabledStyle={styles.buttonDisabledStyle}
      buttonStyle={{
        ...styles.buttonDefaultStyle,
        ...buttonStyle,
      }}
      containerStyle={{
        width: getButtonWidth(),
        alignSelf: align,
        ...containerStyle,
      }}
      size={size}
      onPress={onPress}>
      {icon !== null && icon}
      <BaseText
        h3
        style={
          disabled ? styles.disabledButtonTextStyle : styles.buttonTextStyle
        }>
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
    buttonDisabledStyle: {
      backgroundColor: theme.colors.color5,
      opacity: 0.6,
    },
    buttonTextStyle: {
      color: theme.colors.white,
    },
    disabledButtonTextStyle: {
      color: theme.colors.color4,
    },
  });
