import { ScrollView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet, View } from 'react-native';
import { useTheme, Icon, FAB } from '@rneui/themed';

import HideKeyboard from './HideKeyboard';

const BaseScreen = ({
  children,
  fabProps = {
    show: false,
    placement: 'right',
    iconName: '',
    iconType: '',
    iconColor: '',
    color: '',
    onPress: function () {},
  },
  useScrollView = false,
  style = {},
}) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  const renderView = () => {
    if (useScrollView) {
      return (
        <ScrollView style={{ ...styles.view, ...style }}>{children}</ScrollView>
      );
    }
    return <View style={{ ...styles.view, ...style }}>{children}</View>;
  };

  return (
    <HideKeyboard>
      <SafeAreaView>
        {renderView()}
        {fabProps.show && (
          <FAB
            placement={fabProps.placement}
            icon={
              <Icon
                name={fabProps.iconName}
                color={fabProps.iconColor}
                type={fabProps.iconType}
              />
            }
            color={fabProps.color}
            onPress={fabProps.onPress}
          />
        )}
      </SafeAreaView>
    </HideKeyboard>
  );
};

const getStyles = theme =>
  StyleSheet.create({
    view: {
      flexGrow: 1,
      paddingHorizontal: theme.spacing.xl,
      height: '100%',
    },
  });

export default BaseScreen;
