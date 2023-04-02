import { ScrollView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet } from 'react-native';
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
}) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  return (
    <HideKeyboard>
      <SafeAreaView>
        <ScrollView style={styles.scrollView}>{children}</ScrollView>
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
    scrollView: {
      flexGrow: 1,
      paddingHorizontal: theme.spacing.xl,
      height: '100%',
    },
  });

export default BaseScreen;
