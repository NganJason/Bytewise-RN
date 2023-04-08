import { TouchableOpacity } from 'react-native';

import BaseInput from './BaseInput';

const TouchInput = ({ onPress = function () {}, label = '', value = '' }) => {
  return (
    <TouchableOpacity activeOpacity={1} onPress={onPress}>
      <BaseInput label={label} pointerEvents="none" value={value} readOnly />
    </TouchableOpacity>
  );
};

export default TouchInput;
