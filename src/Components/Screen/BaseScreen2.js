import { StyleSheet, View } from 'react-native';
import { useTheme, Icon, FAB } from '@rneui/themed';

import { BaseToast } from '../View';
import HideKeyboard from './HideKeyboard';
import { useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDimension } from '../../_shared/hooks';
import { BackIcon, DrawerIcon, HideInfoIcon } from '../Common/Icon';

const BaseScreen2 = ({
  children,
  headerProps = {
    component: null,
    backgroundColor: '#F3F7FB',
    allowBack: false,
    allowDrawer: false,
    allowHideInfo: false,
  },
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
  errorToast = {
    show: false,
    message1: '',
    message2: '',
    onHide: function () {},
  },
  enablePadding = true,
}) => {
  const { theme } = useTheme();
  const { screenHeight } = useDimension();
  const styles = getStyles(theme, screenHeight);
  const { backgroundColor = '#F3F7FB' } = headerProps;

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

  return (
    <HideKeyboard>
      <>
        <SafeAreaView
          style={{
            ...styles.header,
            backgroundColor: backgroundColor,
          }}>
          <>
            <View style={styles.iconContainer}>
              {headerProps.allowDrawer && (
                <View style={styles.icon}>
                  <DrawerIcon />
                </View>
              )}
              {headerProps.allowBack && (
                <View style={styles.icon}>
                  <BackIcon />
                </View>
              )}
              {headerProps.allowHideInfo && (
                <View style={styles.icon}>
                  <HideInfoIcon />
                </View>
              )}
            </View>
            <View style={styles.headerContent}>{headerProps.component}</View>
          </>
        </SafeAreaView>

        <View style={[styles.body, enablePadding && styles.paddingHori]}>
          {children}
        </View>

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
        <BaseToast />
      </>
    </HideKeyboard>
  );
};

const getStyles = (theme, screenHeight) =>
  StyleSheet.create({
    header: {
      minHeight: screenHeight * 0.25,
      paddingHorizontal: 26,
      paddingBottom: 22,
      paddingTop: 10,
    },
    headerContent: {
      marginTop: theme.spacing.md,
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: 'center',
    },
    iconContainer: { flexDirection: 'row', alignItems: 'center' },
    icon: { marginRight: 8 },
    body: {
      flex: 1,
      paddingVertical: theme.spacing.md,
      backgroundColor: theme.colors.white,
      shadowColor: theme.colors.black,
      shadowOffset: {
        width: 2,
        height: -5,
      },
      shadowOpacity: 0.2,
      shadowRadius: 10,
      elevation: 10,
    },
    paddingHori: {
      paddingHorizontal: 26,
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
    },
  });

export default BaseScreen2;
