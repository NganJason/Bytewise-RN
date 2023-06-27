import { StyleSheet, View } from 'react-native';
import { useTheme, Icon, FAB, Header } from '@rneui/themed';
import { BaseLoadableView, BaseToast } from '../View';
import HideKeyboard from './HideKeyboard';
import { useEffect } from 'react';
import { BackIcon, DrawerIcon } from '../Common/Icon';

const BaseScreen = ({
  children,
  backgroundColor = '#FFF',
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
    allowBack: false,
    allowDrawer: false,
    leftComponent: null,
    centerComponent: null,
    rightComponent: null,
  },
  allowLoadable = true,
  isLoading = false,
  enablePadding = true,
  errorToast = {
    show: false,
    message1: '',
    message2: '',
    onHide: function () {},
  },
}) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  useEffect(() => {
    if (errorToast.show) {
      BaseToast.show({
        type: 'error',
        text1: errorToast.message1,
        text2: errorToast.message2,
        onHide: errorToast.onHide,
      });
    }
  }, [
    errorToast.show,
    errorToast.message1,
    errorToast.message2,
    errorToast.onHide,
  ]);

  const isEmptyHeader = () =>
    !headerProps.allowBack &&
    !headerProps.centerComponent &&
    !headerProps.leftComponent &&
    !headerProps.rightComponent;

  const getLeftComponent = () => {
    if (headerProps.allowDrawer) {
      return <DrawerIcon />;
    } else if (headerProps.allowBack) {
      return <BackIcon />;
    }

    return headerProps.leftComponent;
  };

  return (
    <>
      {!isEmptyHeader() && (
        <Header
          containerStyle={[styles.header, { backgroundColor: backgroundColor }]}
          leftComponent={getLeftComponent()}
          centerComponent={headerProps.centerComponent}
          rightComponent={headerProps.rightComponent}
          leftContainerStyle={styles.leftComponentStyle}
          centerContainerStyle={styles.centerComponentStyle}
          rightContainerStyle={styles.rightComponentStyle}
        />
      )}

      <HideKeyboard>
        <>
          {allowLoadable ? (
            <BaseLoadableView
              isLoading={isLoading}
              containerStyle={[
                enablePadding && styles.paddingHori,
                { backgroundColor: backgroundColor },
              ]}>
              {children}
            </BaseLoadableView>
          ) : (
            <View
              style={[
                enablePadding && styles.paddingHori,
                { backgroundColor: backgroundColor },
              ]}>
              {children}
            </View>
          )}
          {fabProps.show && (
            <FAB
              placement={fabProps.placement}
              size={'medium'}
              icon={
                <Icon
                  name={fabProps.iconName}
                  color={fabProps.iconColor}
                  type={fabProps.iconType}
                />
              }
              color={fabProps.color}
              onPress={fabProps.onPress}
              style={styles.fab}
            />
          )}
        </>
      </HideKeyboard>
      <BaseToast />
    </>
  );
};

const getStyles = theme =>
  StyleSheet.create({
    container: {
      minHeight: '100%',
    },
    body: {
      minHeight: '100%',
      flex: 1,
    },
    paddingHori: {
      paddingHorizontal: 26,
    },
    header: {
      backgroundColor: theme.colors.white,
      paddingHorizontal: 26,
      borderBottomWidth: 0,
      paddingVertical: 22,
    },
    emptyHeader: {
      paddingVertical: 0,
    },
    leftComponentStyle: {
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: 'flex-start',
    },
    centerComponentStyle: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    rightComponentStyle: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      alignItems: 'flex-start',
    },
    fab: {
      backgroundColor: theme.colors.color1, // not the real backgroundColor, set to prevent warning
      shadowColor: theme.colors.black,
      shadowOffset: {
        width: 1,
        height: 1,
      },
      shadowOpacity: 0.4,
      shadowRadius: 3,
      elevation: 4,
    },
  });

export default BaseScreen;
