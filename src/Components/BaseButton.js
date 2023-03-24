import { Button } from '@rneui/themed';

const BaseButton = ({
  type = 'solid',
  title = '',
  loading = false,
  disabled = false,
  width = 0,
  fullWidth = true,
  align = 'center',
  size = 'md',
  buttonStyle,
  containerStyle,
  ...props
}) => {
  const getButtonWidth = () => {
    switch (true) {
      case width !== 0:
        return width;
      case fullWidth || width === 0:
        return '100%';
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
      {...props}
    />
  );
};

export default BaseButton;
