import { useNavigation } from '@react-navigation/native';
import { useTheme } from '@rneui/themed';
import { View } from 'react-native';
import { IconButton } from '../Touch';

export const BackIcon = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();

  return (
    <IconButton
      buttonSize="xs"
      type="clear"
      onPress={() => navigation.goBack()}
      iconName="arrow-left"
      iconType="feather"
      color={theme.colors.color8}
      align="left"
    />
  );
};

export const DrawerIcon = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();

  return (
    <View>
      <IconButton
        buttonSize="sm"
        type="clear"
        onPress={() => navigation.openDrawer()}
        iconName="menu"
        iconType="entypo"
        color={theme.colors.color8}
        align="left"
      />
    </View>
  );
};
