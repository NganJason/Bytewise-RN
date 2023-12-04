import { useState, useEffect, useMemo, useRef, Fragment } from 'react';
import {
  StyleSheet,
  Keyboard,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import {
  BottomSheetModal,
  BottomSheetModalProvider,
} from '@gorhom/bottom-sheet';
import { Header, FAB, useTheme, Icon } from '@rneui/themed';

import { BaseToast, BaseLoadableViewV2 } from '../View';
import { useDimension } from '../../_shared/hooks';
import { BackIcon, DrawerIcon, HideInfoIcon } from '../Common';
import { LinearGradient } from 'expo-linear-gradient';

const STANDARD_PADDING = 25;

const HideKeyboard = ({ children }) => (
  <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
    {children}
  </TouchableWithoutFeedback>
);

const BaseScreenV2 = ({
  children,
  isLoading = false,
  disableScroll = false,
  subHeader = null,
  enableSubHeaderScroll = false,
  headerProps: {
    leftComponent = null,
    rightComponent = null,
    centerComponent = null,
    headerStyle: headerStyle = {},
  } = {},
  fabProps: {
    show: showFab = false,
    placement = 'right',
    onPress: onFabPress = function () {},
    color: fabColor = '',
  } = {},
  hideInfoButtonProps: { show: showHideInfoButon = false } = {},
  backButtonProps: { show: showBackButton = false } = {},
  drawerButtonProps: { show: showDrawerButton = false } = {},
  bottomSheetModalProps: {
    show: showBottomSheetModel = false,
    headerComponent: bottomSheetModalHeader = null,
    bodyComponent: bottomSheetModalBody = null,
    isLoading: isBottomSheetModalLoading = false,
  } = {},
}) => {
  const [isKeyboardOpen, setKeyboardOpen] = useState(false);

  const { theme } = useTheme();
  const screenDimension = useDimension();
  const insets = useSafeAreaInsets();
  const styles = getStyles(theme, {
    screenDimension: screenDimension,
    isKeyboardOpen,
    hasFAB: showFab,
  });

  const bottomSheetModalRef = useRef(null);
  const snapPoints = useMemo(() => ['10%', '40%', '70%', '90%'], []);

  useEffect(() => {
    bottomSheetModalRef?.current?.present();
  }, [showBottomSheetModel]);

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
    const comps = [];

    if (showHideInfoButon) {
      comps.push(
        <View key={1} style={styles.hideInfo}>
          <HideInfoIcon />
        </View>,
      );
    }

    if (showDrawerButton) {
      comps.push(<DrawerIcon key={2} />);
    }

    if (rightComponent !== null) {
      comps.push(<Fragment key={3}>{rightComponent}</Fragment>);
    }

    if (comps.length === 0) {
      return null;
    }

    return <>{comps}</>;
  };

  const renderHeader = () => {
    if (
      centerComponent === null &&
      getLeftComponent() === null &&
      getRightComponent() === null
    ) {
      return null;
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
          ...headerStyle,
          marginTop: -insets.top, // offset safe area inset
        }}
      />
    );
  };

  bottomSheetModalRef.current?.present();
  return (
    <LinearGradient
      colors={[theme.colors.color4, 'white']}
      style={styles.linearGradient}>
      <View style={[styles.screen, { paddingTop: Math.max(insets.top, 16) }]}>
        {renderHeader()}
        <HideKeyboard>
          <ScrollViewWrapper disableScroll={!enableSubHeaderScroll}>
            {subHeader !== null && (
              <View style={styles.subHeader}>{subHeader}</View>
            )}
            <View
              style={[
                styles.body,
                (renderHeader() !== null || subHeader !== null) &&
                  styles.bodyShadow,
              ]}>
              <BaseLoadableViewV2 isLoading={isLoading}>
                <ScrollViewWrapper
                  disableScroll={enableSubHeaderScroll || disableScroll}>
                  {children}
                </ScrollViewWrapper>
              </BaseLoadableViewV2>
              {showBottomSheetModel && (
                <BottomSheetModalProvider>
                  <BottomSheetModal
                    backgroundStyle={styles.bottomSheetModal}
                    handleStyle={styles.bottomSheetModalHandler}
                    enablePanDownToClose={false}
                    ref={bottomSheetModalRef}
                    index={0}
                    snapPoints={snapPoints}>
                    <View
                      style={{
                        ...styles.subHeader,
                        backgroundColor: theme.colors.white,
                      }}>
                      {bottomSheetModalHeader}
                    </View>
                    <BaseLoadableViewV2 isLoading={isBottomSheetModalLoading}>
                      <KeyboardAwareScrollView
                        contentContainerStyle={{
                          ...styles.scrollView,
                          ...styles.body,
                          ...styles.bottomSheetModalBody,
                        }}
                        showsHorizontalScrollIndicator={false}
                        showsVerticalScrollIndicator={false}>
                        {bottomSheetModalBody}
                      </KeyboardAwareScrollView>
                    </BaseLoadableViewV2>
                  </BottomSheetModal>
                </BottomSheetModalProvider>
              )}
            </View>
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
          </ScrollViewWrapper>
        </HideKeyboard>
        <BaseToast />
      </View>
    </LinearGradient>
  );
};

const ScrollViewWrapper = ({ disableScroll = true, children }) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  if (disableScroll) {
    return <View style={styles.scrollView}>{children}</View>;
  }
  return (
    <KeyboardAwareScrollView
      // to solve keyboard jump problem
      // https://github.com/APSL/react-native-keyboard-aware-scroll-view/issues/418
      keyboardOpeningTime={Number.MAX_SAFE_INTEGER}
      extraScrollHeight={20}
      contentContainerStyle={styles.scrollView}
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}>
      {children}
    </KeyboardAwareScrollView>
  );
};

const getStyles = (
  theme,
  {
    screenDimension: { screenHeight = 0 } = {},
    isKeyboardOpen = false,
    hasFAB = false,
  } = {},
) =>
  StyleSheet.create({
    linearGradient: {
      flex: 1,
    },
    screen: {
      flex: 1,
    },
    header: {
      backgroundColor: theme.colors.color4,
      minHeight: screenHeight * 0.1,
      paddingHorizontal: STANDARD_PADDING,
      paddingTop: STANDARD_PADDING,
      paddingBottom: STANDARD_PADDING,
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
      backgroundColor: theme.colors.color4,
    },
    body: {
      flex: 1,
      paddingHorizontal: STANDARD_PADDING,
      paddingTop: STANDARD_PADDING,
      paddingBottom: isKeyboardOpen || !hasFAB ? STANDARD_PADDING : 70, // space for FAB
      backgroundColor: theme.colors.white,
    },
    bottomSheetModalBody: {
      paddingTop: 0, // remove paddingTop of body
    },
    bodyShadow: {
      shadowColor: theme.colors.black,
      shadowOffset: {
        width: 2,
        height: -1,
      },
      shadowOpacity: 0.2,
      shadowRadius: 5,
      borderTopRightRadius: 10,
      borderTopLeftRadius: 10,
      elevation: 10,
    },
    scrollView: {
      flexGrow: 1,
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
    bottomSheetModalHandler: {
      paddingTop: 20,
    },
    bottomSheetModal: {
      shadowColor: theme.colors.black,
      shadowOffset: {
        width: 2,
        height: -5,
      },
      shadowOpacity: 0.2,
      shadowRadius: 10,
      elevation: 10,
    },
    hideInfo: {
      marginRight: 12,
    },
  });

export default BaseScreenV2;
