import { useNavigation } from '@react-navigation/native';
import { useTheme } from '@rneui/themed';
import { View } from 'react-native';
import { IconButton } from '../Touch';

export const BackIcon = ({ onBack = null }) => {
  const { theme } = useTheme();
  const navigation = useNavigation();

  const onPress = () => {
    if (onBack !== null) {
      onBack();
      return;
    }
    navigation.goBack();
  };

  return (
    <IconButton
      buttonSize="xs"
      type="clear"
      onPress={onPress}
      iconName="arrow-left"
      iconType="feather"
      color={theme.colors.color8}
      align="flex-start"
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
        align="flex-start"
      />
    </View>
  );
};
