import { useTheme } from '@rneui/themed';
import { useContext } from 'react';
import { BottomToastContext } from '../../_shared/context';
import { IconButton } from '../Touch';

const InfoToolTip = ({
  iconSize = 15,
  title = '',
  message = '',
  customChildren = null,
}) => {
  const { theme } = useTheme();
  const { toast } = useContext(BottomToastContext);

  const onInfoIconPress = () => {
    if (customChildren !== null) {
      toast.custom(customChildren);
      return;
    }
    toast.info(message, title);
  };

  return (
    <IconButton
      iconName="info"
      iconType="feather"
      type="clear"
      color={theme.colors.color1}
      iconSize={iconSize}
      align="flex-start"
      onPress={onInfoIconPress}
    />
  );
};

export default InfoToolTip;
