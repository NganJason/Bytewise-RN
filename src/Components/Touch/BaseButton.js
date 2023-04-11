import { Button, useTheme } from '@rneui/themed';
import { StyleSheet } from 'react-native';

import BaseText from '../Text/BaseText';

const BaseButton = ({
  type = 'solid',
  title = '', // TODO: Wrap text styles
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
        return '90%';
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
      buttonStyle={{
        ...styles.buttonDefaultStyle,
        width: getButtonWidth(),
        ...(!fullWidth ? { alignSelf: align } : { alignSelf: 'center' }),
        ...buttonStyle,
      }}
      containerStyle={{
        ...containerStyle,
      }}
      size={size}
      onPress={onPress}>
      {icon !== null && icon}
      <BaseText h2 style={{ color: theme.colors.white }}>
        {title}
      </BaseText>
    </Button>
  );
};

export default BaseButton;

const getStyles = theme =>
  StyleSheet.create({
    buttonDefaultStyle: {
      ...theme.button,
    },
  });
