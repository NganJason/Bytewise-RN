import { TouchableOpacity } from 'react-native';

import BaseInput from './BaseInput';

const TouchInput = ({
  onPress = function () {},
  label = '',
  value = '',
  disabled = false,
  ...props
}) => {
  return (
    <TouchableOpacity activeOpacity={1} onPress={onPress} disabled={disabled}>
      <BaseInput
        label={label}
        pointerEvents="none"
        value={value}
        readOnly
        {...props}
      />
    </TouchableOpacity>
  );
};

export default TouchInput;
