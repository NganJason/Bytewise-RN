import { Icon } from '@rneui/themed';

import { THEME } from '../../_shared/constant/theme';
import { TouchableOpacity } from 'react-native-gesture-handler';

const IconButton = ({
  onPress = function () {},
  iconName = '',
  iconType = '',
  iconSize = 28,
  color = THEME.colors.color4,
  align = 'flex-start',
  buttonStyle = {},
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      containerStyle={buttonStyle}
      style={{ alignItems: align }}>
      <Icon name={iconName} type={iconType} size={iconSize} color={color} />
    </TouchableOpacity>
  );
};

export default IconButton;
