import { useState, useEffect } from 'react';
import {
  StyleSheet,
  Keyboard,
  TouchableWithoutFeedback,
  ActivityIndicator,
  View,
} from 'react-native';
import { BaseToast } from '../View';
import { useDimension } from '../../_shared/hooks';
import { Header, FAB, useTheme, Icon } from '@rneui/themed';
import { BackIcon, DrawerIcon } from '../Common';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const WAIT_TIME_FOR_INDICATOR = 1000;
const STANDARD_PADDING = 25;

const HideKeyboard = ({ children }) => (
  <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
    {children}
  </TouchableWithoutFeedback>
);

const BaseScreenV2 = ({
  children,
  isLoading = false,
  subHeader = null,
  headerProps: {
    leftComponent = null,
    rightComponent = null,
    centerComponent = null,
  } = {},
  fabProps: {
    show: showFab = false,
    placement = 'right',
    onPress: onFabPress = function () {},
    color: fabColor = '',
  } = {},
  backButtonProps: { show: showBackButton = false } = {},
  drawerButtonProps: { show: showDrawerButton = false } = {},
}) => {
  const [isKeyboardOpen, setKeyboardOpen] = useState(false);
  const [showLoadingIndicator, setShowLoadingIndicator] = useState(false);

  const { theme } = useTheme();
  const screenDimension = useDimension();
  const insets = useSafeAreaInsets();
  const styles = getStyles(theme, {
    screenDimension: screenDimension,
    isKeyboardOpen,
    hasFAB: showFab,
  });

  // show loading indicator if isLoading stays true for >= WAIT_TIME_FOR_INDICATOR
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

  // checks if keyboard is opened
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardOpen(true);
      },
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardOpen(false);
      },
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  const getLeftComponent = () => {
    if (showBackButton) {
      return (
        <>
          <BackIcon />
          {leftComponent}
        </>
      );
    }
    return leftComponent;
  };

  const getRightComponent = () => {
    if (showDrawerButton) {
      return (
        <>
          <DrawerIcon />
          {rightComponent}
        </>
      );
    }
    return rightComponent;
  };

  const renderHeader = () => {
    if (
      centerComponent === null &&
      getLeftComponent() === null &&
      getRightComponent() === null
    ) {
      return <></>;
    }
    return (
      <Header
        leftContainerStyle={[
          styles.headerComponent,
          styles.headerLeftComponent,
        ]}
        centerContainerStyle={[
          styles.headerComponent,
          styles.headerCenterComponent,
        ]}
        rightContainerStyle={[
          styles.headerComponent,
          styles.headerRightComponent,
        ]}
        leftComponent={getLeftComponent()}
        centerComponent={centerComponent}
        rightComponent={getRightComponent()}
        containerStyle={{
          ...styles.header,
          marginTop: -insets.top, // offset safe area inset
        }}
      />
    );
  };

  const renderBody = () => {
    if (showLoadingIndicator) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.color1} />
        </View>
      );
    }

    if (!isLoading) {
      return (
        <>
          {subHeader && <View style={styles.subHeader}>{subHeader}</View>}
          <KeyboardAwareScrollView
            extraScrollHeight={20}
            contentContainerStyle={styles.scrollView}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}>
            {children}
          </KeyboardAwareScrollView>
          {showFab && (
            <FAB
              color={fabColor === '' ? theme.colors.color1 : fabColor}
              placement={placement}
              size={'medium'}
              onPress={onFabPress}
              style={styles.fab}
              icon={
                <Icon name="plus" type="entypo" color={theme.colors.white} />
              }
            />
          )}
        </>
      );
    } else {
      return <></>;
    }
  };

  return (
    <SafeAreaView style={styles.screen}>
      {renderHeader()}
      <HideKeyboard>
        <>{renderBody()}</>
      </HideKeyboard>
      <BaseToast />
    </SafeAreaView>
  );
};

const getStyles = (
  theme,
  {
    screenDimension: { screenHeight = 0 } = {},
    isKeyboardOpen = false,
    hasFAB = false,
  },
) =>
  StyleSheet.create({
    screen: {
      flex: 1,
    },
    header: {
      backgroundColor: theme.colors.white,
      minHeight: screenHeight * 0.1,
      paddingHorizontal: 20,
      paddingVertical: 20,
      borderBottomWidth: 0,
    },
    headerComponent: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    headerCenterComponent: {
      justifyContent: 'center',
      flex: 3,
    },
    headerLeftComponent: {
      justifyContent: 'flex-start',
      flex: 1,
    },
    headerRightComponent: {
      justifyContent: 'flex-end',
      flex: 1,
    },
    subHeader: {
      paddingHorizontal: STANDARD_PADDING,
      paddingTop: 0,
      paddingBottom: STANDARD_PADDING,
    },
    scrollView: {
      flexGrow: 1,
      paddingHorizontal: STANDARD_PADDING,
      paddingTop: 0,
      paddingBottom: isKeyboardOpen || !hasFAB ? STANDARD_PADDING : 70, // space for FAB
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    fab: {
      backgroundColor: theme.colors.black, // not the real backgroundColor, set to prevent warning
      shadowColor: theme.colors.black,
      shadowOffset: {
        width: 2,
        height: 2,
      },
      shadowOpacity: 0.4,
      shadowRadius: 3,
      elevation: 4,
    },
  });

export default BaseScreenV2;
