import { Button } from '@rneui/themed';

const BaseButton = ({
  type = 'solid',
  title = '',
  loading = false,
  disabled = false,
  width = 0,
  fullWidth = false,
  align = 'center',
  size = 'md',
  buttonStyle,
  containerStyle,
  onPress = function () {},
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
      title={title}
      type={type}
      loading={loading}
      disabled={disabled}
      buttonStyle={{
        width: getButtonWidth(),
        ...buttonStyle,
      }}
      containerStyle={{
        alignItems: align,
        ...containerStyle,
      }}
      size={size}
      onPress={onPress}
    />
  );
};

export default BaseButton;
