import { StyleSheet, View } from 'react-native';
import { useTheme, Icon, FAB, Header } from '@rneui/themed';
import { BaseLoadableView, BaseToast } from '../View';
import HideKeyboard from './HideKeyboard';
import { useEffect } from 'react';
import { BackIcon, DrawerIcon } from '../Common/Icon';
import { useDimension } from '../../_shared/hooks';
import { SafeAreaView } from 'react-native-safe-area-context';

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
    marginBottom: 0,
  },
  headerProps = {
    allowBack: false,
    onBack: null, // default to go back to previous page
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
  const { screenHeight } = useDimension();
  const styles = getStyles(theme, screenHeight);

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
      return <BackIcon onBack={headerProps.onBack} />;
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

      <SafeAreaWrapper enableSafeArea={isEmptyHeader()}>
        <HideKeyboard>
          <View style={styles.body}>
            {allowLoadable ? (
              <BaseLoadableView
                isLoading={isLoading}
                containerStyle={[
                  enablePadding && styles.paddingHori,
                  styles.container,
                  { backgroundColor: backgroundColor },
                ]}>
                {children}
              </BaseLoadableView>
            ) : (
              <View
                style={[
                  enablePadding && styles.paddingHori,
                  styles.container,
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
                style={[
                  styles.fab,
                  fabProps.marginBottom && { bottom: fabProps.marginBottom },
                ]}
              />
            )}
          </View>
        </HideKeyboard>
      </SafeAreaWrapper>
      <BaseToast />
    </>
  );
};

const SafeAreaWrapper = ({ children, enableSafeArea = false }) => {
  const { theme } = useTheme();
  const { screenHeight } = useDimension();
  const styles = getStyles(theme, screenHeight);

  if (enableSafeArea) {
    return <SafeAreaView style={styles.safeAreaView}>{children}</SafeAreaView>;
  }
  return children;
};

const getStyles = (theme, screenHeight) =>
  StyleSheet.create({
    paddingHori: {
      paddingHorizontal: 26,
    },
    header: {
      minHeight: screenHeight * 0.1,
      paddingHorizontal: 26,
      borderBottomWidth: 0,
      paddingTop: 10,
      paddingBottom: 20,
    },
    safeAreaView: {
      flex: 1,
    },
    body: {
      flex: 1,
    },
    container: {
      flex: 1,
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
      alignItems: 'center',
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
      position: 'absolute',
      bottom: 0,
      right: 0,
    },
  });

export default BaseScreen;
