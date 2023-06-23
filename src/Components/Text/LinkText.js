import { useTheme } from '@rneui/themed';
import { TouchableOpacity } from 'react-native-gesture-handler';

import BaseText from './BaseText';

const LinkText = ({ children = '', onPress = function () {}, ...props }) => {
  const { theme } = useTheme();

  return (
    <TouchableOpacity onPress={onPress}>
      <BaseText style={theme.fontStyles.linkText} {...props}>
        {children}
      </BaseText>
    </TouchableOpacity>
  );
};

export default LinkText;
