import { Button } from '@rneui/themed';

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
  onPress = function () {},
  buttonStyle = {},
  containerStyle = {},
}) => {
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
      title={title}
      type={type}
      loading={loading}
      disabled={disabled}
      buttonStyle={{
        width: getButtonWidth(),
        ...buttonStyle,
      }}
      containerStyle={{
        ...(!fullWidth && { alignItems: align }),
        ...containerStyle,
      }}
      size={size}
      onPress={onPress}
    />
  );
};

export default BaseButton;
