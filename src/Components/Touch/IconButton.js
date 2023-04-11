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
  color = THEME.colors.black,
}) => {
  return (
    <BaseButton
      size={buttonSize}
      type={type}
      onPress={onPress}
      icon={
        <Icon name={iconName} type={iconType} size={iconSize} color={color} />
      }
    />
  );
};

export default IconButton;
