import BaseInput from './BaseInput';

const TouchInput = ({
  onPress = function () {},
  label = '',
  value = '',
  disabled = false,
  hide = false,
  placeholder = '',
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
      onPress={onPress}
      disabled={disabled}
      placeholder={placeholder}
      {...props}
    />
  );
};

export default TouchInput;
