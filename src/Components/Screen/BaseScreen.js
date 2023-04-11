import { StyleSheet, View } from 'react-native';
import { useTheme, Icon, FAB, Header } from '@rneui/themed';
import { useNavigation } from '@react-navigation/native';
import { PacmanIndicator } from 'react-native-indicators';

import HideKeyboard from '../Screen/HideKeyboard';
import IconButton from '../Touch/IconButton';

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
    leftComponent: {},
    centerComponent: {},
    rightComponent: {},
    leftComponentStyle: {},
    centerComponentStyle: {},
    rightComponentStyle: {},
  },
  isLoading = false,
  bodyStyle = {},
}) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  const navigation = useNavigation();

  return (
    <>
      {headerProps.show && (
        <Header
          containerStyle={styles.header}
          leftComponent={
            headerProps.allowBack ? (
              <IconButton
                buttonSize="xs"
                type="clear"
                onPress={() => navigation.goBack()}
                iconName="chevron-left"
                iconType="entypo"
                color={theme.colors.color4}
              />
            ) : (
              headerProps.leftComponent
            )
          }
          centerComponent={headerProps.centerComponent}
          rightComponent={headerProps.rightComponent}
          leftContainerStyle={{
            ...headerProps.leftComponentStyle,
            ...styles.leftHeaderContainerStyle,
            ...styles.backIcon,
          }}
          centerContainerStyle={{
            ...headerProps.centerComponentStyle,
            ...styles.centerHeaderContainerStyle,
          }}
          rightContainerStyle={{
            ...headerProps.rightComponentStyle,
            ...styles.rightHeaderContainerStyle,
          }}
        />
      )}
      <HideKeyboard>
        <View style={{ ...styles.body, ...bodyStyle }}>
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
    </>
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
      paddingHorizontal: theme.spacing.xl,
    },
    backIcon: {
      justifyContent: 'flex-start',
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
