import { Icon } from '@rneui/themed';

import { THEME } from '../../_shared/constant/theme';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { View } from 'react-native';

const IconButton = ({
  onPress = function () {},
  iconName = '',
  iconType = '',
  iconSize = 28,
  color = THEME.colors.color4,
  align = 'flex-start',
  buttonStyle = {},
  containerStyle = {},
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{ alignItems: align, ...buttonStyle }}>
      <View style={containerStyle}>
        <Icon name={iconName} type={iconType} size={iconSize} color={color} />
      </View>
    </TouchableOpacity>
  );
};

export default IconButton;
