import { StyleSheet, View } from 'react-native';
import { useTheme, Icon, FAB } from '@rneui/themed';
import { useNavigation } from '@react-navigation/native';

import { BaseLoadableView, BaseScrollView, BaseToast } from '../View';
import HideKeyboard from './HideKeyboard';
import { useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import useDimension from '../../_shared/hooks/dimension';
import { IconButton } from '../Touch';

const BaseScreen2 = ({
  children,
  headerProps = {
    component: null,
    backgroundColor: '#F3F7FB',
    allowBack: false,
    allowDrawer: false,
  },
  fabProps = {
    show: false,
    placement: 'right',
    iconName: '',
    iconType: '',
    iconColor: '',
    color: '',
    onPress: function () {},
  },
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
  const navigation = useNavigation();
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

  const getDrawerIcon = () => {
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

  const getBackIcon = () => {
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

  return (
    <HideKeyboard>
      <>
        <SafeAreaView
          style={{
            ...styles.header,
            backgroundColor: backgroundColor,
          }}>
          <>
            {headerProps.allowDrawer && getDrawerIcon()}
            {headerProps.allowBack && getBackIcon()}
            <View style={styles.headerContent}>{headerProps.component}</View>
          </>
        </SafeAreaView>

        <View style={styles.body}>{children}</View>

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
    },
    headerContent: {
      marginTop: theme.spacing.lg,
      paddingHorizontal: 24,
      flexDirection: 'row',
      justifyContent: 'left',
      alignItems: 'center',
    },
    body: {
      paddingVertical: theme.spacing.md,
      paddingHorizontal: 26,
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

export default BaseScreen2;
