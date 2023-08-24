import BaseInput from './BaseInput';

const TouchInput = ({
  onPress = function () {},
  label = '',
  value = '',
  disabled = false,
  hide = false,
  ...props
}) => {
  if (hide) {
    return <></>;
  }

  return (
    <BaseInput
      label={label}
      value={value}
      readOnly
      onPressIn={onPress}
      disabled={disabled}
      {...props}
    />
  );
};

export default TouchInput;
