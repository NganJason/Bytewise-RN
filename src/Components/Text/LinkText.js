import { useNavigation } from '@react-navigation/native';
import { useTheme } from '@rneui/themed';
import { TouchableOpacity } from 'react-native-gesture-handler';

import BaseText from './BaseText';

const LinkText = ({ children = '', route = '' }) => {
  const { theme } = useTheme();
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate(route);
      }}>
      <BaseText style={theme.fontStyles.linkText}>{children}</BaseText>
    </TouchableOpacity>
  );
};

export default LinkText;
