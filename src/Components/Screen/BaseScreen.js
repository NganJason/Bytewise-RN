import { StyleSheet, View } from 'react-native';
import { useTheme, Icon, FAB, Header } from '@rneui/themed';
import { useNavigation } from '@react-navigation/native';
import { PacmanIndicator } from 'react-native-indicators';

import HideKeyboard from './HideKeyboard';

import { IconButton } from '../Touch';

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
  headerProps = {
    show: false,
    allowBack: false,
    centerComponent: {},
    rightComponent: {},
  },
  isLoading = false,
  style = {},
}) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  const navigation = useNavigation();

  return (
    <View>
      {headerProps.show && (
        <Header
          containerStyle={styles.header}
          leftComponent={
            headerProps.allowBack && (
              <IconButton
                buttonSize="xs"
                type="clear"
                onPress={() => navigation.goBack()}
                iconName="chevron-left"
                iconType="entypo"
              />
            )
          }
          centerComponent={headerProps.centerComponent}
          rightComponent={headerProps.rightComponent}
          leftContainerStyle={styles.leftHeaderContainerStyle}
          centerContainerStyle={styles.centerHeaderContainerStyle}
          rightContainerStyle={styles.rightHeaderContainerStyle}
        />
      )}
      <HideKeyboard>
        <View style={{...styles.body, ...style}}>
          {isLoading ? (
            <PacmanIndicator size={70} color={theme.colors.primary} />
          ) : (
            <>
              {children}
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
            </>
          )}
        </View>
      </HideKeyboard>
    </View>
  );
};

const getStyles = theme =>
  StyleSheet.create({
    body: {
      paddingHorizontal: 28,
      height: '100%',
      flex: 1,
    },
    header: {
      backgroundColor: theme.colors.white,
      borderBottomWidth: 0,
      paddingVertical: 16,
    },
    leftHeaderContainerStyle: {
      justifyContent: 'center',
    },
    centerHeaderContainerStyle: {
      justifyContent: 'center',
    },
    rightHeaderContainerStyle: {
      justifyContent: 'center',
    },
  });

export default BaseScreen;
