import { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { useTheme, Icon, FAB, Header } from '@rneui/themed';
import { useNavigation } from '@react-navigation/native';
import { PacmanIndicator } from 'react-native-indicators';
import Animated, { FadeIn } from 'react-native-reanimated';

import { IconButton } from '../Touch';
import { BaseToast } from '../View';
import HideKeyboard from './HideKeyboard';

const WAIT_TIME_FOR_INDICATOR = 500;

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
    allowBack: false,
    leftComponent: null,
    centerComponent: null,
    rightComponent: null,
  },
  isLoading = false,
  errorToast = {
    show: false,
    message1: '',
    message2: '',
    onHide: function () {},
  },
}) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  const navigation = useNavigation();

  const [showLoadingIndicator, setShowLoadingIndicator] = useState(false);

  useEffect(() => {
    let timer = null;

    if (isLoading) {
      timer = setTimeout(() => {
        // will only show indicator if isLoading takes too long to become false
        setShowLoadingIndicator(true);
      }, WAIT_TIME_FOR_INDICATOR);
    } else {
      if (timer !== null) {
        clearTimeout(timer);
      }
      setShowLoadingIndicator(false);
    }

    return () => {
      if (timer !== null) {
        clearTimeout(timer);
      }
    };
  }, [isLoading]);

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
    <>
      <Header
        containerStyle={styles.header}
        leftComponent={
          <>
            {headerProps.allowBack && (
              <IconButton
                buttonSize="xs"
                type="clear"
                onPress={() => navigation.goBack()}
                iconName="chevron-left"
                iconType="entypo"
                color={theme.colors.color4}
                align="left"
              />
            )}
            {headerProps.leftComponent}
          </>
        }
        centerComponent={headerProps.centerComponent}
        rightComponent={headerProps.rightComponent}
        leftContainerStyle={styles.leftComponentStyle}
        centerContainerStyle={styles.centerComponentStyle}
        rightContainerStyle={styles.rightComponentStyle}
      />
      <HideKeyboard>
        <>
          {showLoadingIndicator && (
            <PacmanIndicator size={70} color={theme.colors.primary} />
          )}
          {!isLoading && (
            <Animated.View entering={FadeIn.duration(400)} style={styles.body}>
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
            </Animated.View>
          )}
        </>
      </HideKeyboard>
      <BaseToast />
    </>
  );
};

const getStyles = theme =>
  StyleSheet.create({
    body: {
      paddingHorizontal: 26,
      height: '100%',
      flex: 1,
    },
    header: {
      backgroundColor: theme.colors.white,
      paddingHorizontal: 26,
      borderBottomWidth: 0,
      paddingVertical: 22,
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
  });

export default BaseScreen;
