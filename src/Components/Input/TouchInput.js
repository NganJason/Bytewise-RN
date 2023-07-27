import { TouchableOpacity } from 'react-native';

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
    <TouchableOpacity activeOpacity={1} onPress={onPress} disabled={disabled}>
      <BaseInput
        label={label}
        pointerEvents="none"
        value={value}
        readOnly
        disabled={disabled}
        {...props}
      />
    </TouchableOpacity>
  );
};

export default TouchInput;
