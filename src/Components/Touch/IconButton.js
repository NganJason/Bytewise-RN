import { Icon } from '@rneui/themed';

import BaseButton from './BaseButton';

import { THEME } from '../../_shared/constant/theme';

const IconButton = ({
  onPress = function () {},
  iconName = '',
  iconType = '',
  type = 'solid',
  buttonSize = 'md',
  iconSize = 28,
  color = THEME.colors.color4,
  align = 'center',
  buttonStyle = {},
}) => {
  return (
    <BaseButton
      size={buttonSize}
      type={type}
      onPress={onPress}
      align={align}
      buttonStyle={buttonStyle}
      icon={
        <Icon name={iconName} type={iconType} size={iconSize} color={color} />
      }
    />
  );
};

export default IconButton;
