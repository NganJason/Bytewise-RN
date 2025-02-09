import { useState, useEffect, useMemo, useRef, Fragment } from 'react';
import {
  StyleSheet,
  Keyboard,
  TouchableWithoutFeedback,
  View,
  Image,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetScrollView,
} from '@gorhom/bottom-sheet';
import { Header, FAB, useTheme, Icon } from '@rneui/themed';

import { BaseToast, BaseLoadableViewV2 } from '../View';
import { useDimension } from '../../_shared/hooks';
import { BackIcon, DrawerIcon, HideInfoIcon } from '../Common';
import { baseScreenGradient } from '../../_shared/constant/asset';

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
  subHeaderProps: {
    subHeader = null,
    subHeaderScrollable = false, // allows subheader to be scrollable
    enableSubHeaderScroll = false, // controls the enable/disable of subheader scroll
  } = {},
  bodyProps: {
    enableLinearGradientBackground: enableLinearGradientBackground = false,
    enableBodyShadow: enableBodyShadow = true,
  } = {},
  headerProps: {
    leftComponent = null,
    rightComponent = null,
    centerComponent = null,
    headerStyle: headerStyle = {},
    backgroundColor = '#F3F7FB',
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
    snapPoints: snapPoints = [],
  } = {},
}) => {
  const [isKeyboardOpen, setKeyboardOpen] = useState(false);
  const [enableHeaderShadow, setEnableHeaderShadow] = useState(false);

  const { theme } = useTheme();
  const screenDimension = useDimension();
  const insets = useSafeAreaInsets();
  const styles = getStyles(theme, {
    screenDimension: screenDimension,
    isKeyboardOpen,
    hasFAB: showFab,
  });

  const bottomSheetModalRef = useRef(null);
  const defaultSnapPoints = useMemo(() => [160, '70%', '90%'], []);

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
        containerStyle={[
          styles.header,
          headerStyle,
          { marginTop: -insets.top }, // offset safe area inset
          enableHeaderShadow && styles.headerShadow,
          { backgroundColor: backgroundColor },
        ]}
      />
    );
  };

  const onSubheaderAtTopChange = isAtTop => {
    if (isAtTop) {
      setEnableHeaderShadow(false);
    } else {
      setEnableHeaderShadow(true);
    }
  };

  bottomSheetModalRef.current?.present();
  return (
    <View style={[styles.screen, { paddingTop: Math.max(insets.top, 16) }]}>
      {enableLinearGradientBackground && (
        // create background gradient to prevent white space during scroll
        <Image source={baseScreenGradient} style={styles.backgroundImage} />
      )}
      <View>{renderHeader()}</View>
      <HideKeyboard>
        <ScrollViewWrapper
          scrollable={subHeaderScrollable}
          disableScroll={!enableSubHeaderScroll}
          onIsAtTopChange={onSubheaderAtTopChange}>
          {subHeader !== null && (
            <View
              style={[styles.subHeader, { backgroundColor: backgroundColor }]}>
              {subHeader}
            </View>
          )}
          <View
            style={[
              styles.body,
              (renderHeader() !== null || subHeader !== null) &&
                enableBodyShadow &&
                styles.bodyShadow,
            ]}>
            <BaseLoadableViewV2 isLoading={isLoading}>
              <ScrollViewWrapper
                scrollable={!subHeaderScrollable}
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
                  snapPoints={
                    snapPoints.length > 0 ? snapPoints : defaultSnapPoints
                  }>
                  <View
                    style={{
                      ...styles.subHeader,
                      backgroundColor: theme.colors.white,
                    }}>
                    {bottomSheetModalHeader}
                  </View>
                  <BaseLoadableViewV2 isLoading={isBottomSheetModalLoading}>
                    <BottomSheetScrollView
                      contentContainerStyle={styles.scrollView}
                      showsHorizontalScrollIndicator={false}
                      showsVerticalScrollIndicator={false}>
                      <View style={styles.body}>{bottomSheetModalBody}</View>
                    </BottomSheetScrollView>
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
  );
};

const ScrollViewWrapper = ({
  scrollable = true,
  disableScroll = true,
  children,
  onIsAtTopChange = function (isAtTop) {},
}) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const [isAtTop, setIsAtTop] = useState(true);

  useEffect(() => {
    onIsAtTopChange(isAtTop);
  }, [isAtTop]);

  if (!scrollable) {
    return <View style={styles.scrollView}>{children}</View>;
  }

  const handleScroll = event => {
    const offsetY = event.nativeEvent.contentOffset.y;

    // Check if the scroll view is at the top
    if (offsetY <= 0) {
      setIsAtTop(true);
    } else {
      setIsAtTop(false);
    }
  };

  return (
    <KeyboardAwareScrollView
      // to solve keyboard jump problem
      // https://github.com/APSL/react-native-keyboard-aware-scroll-view/issues/418
      keyboardOpeningTime={Number.MAX_SAFE_INTEGER}
      extraScrollHeight={20}
      scrollEnabled={!disableScroll}
      contentContainerStyle={styles.scrollView}
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
      onScroll={handleScroll}
      scrollEventThrottle={20}
      nestedScrollEnabled>
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
    backgroundImage: {
      flex: 1,
      resizeMode: 'cover', // or 'stretch' or 'contain'
      position: 'absolute',
      width: '100%',
      height: '100%',
    },
    screen: {
      flex: 1,
    },
    header: {
      minHeight: screenHeight * 0.1,
      paddingHorizontal: STANDARD_PADDING,
      paddingTop: STANDARD_PADDING,
      paddingBottom: STANDARD_PADDING,
      borderBottomWidth: 0,
    },
    headerShadow: {
      shadowColor: theme.colors.black,
      shadowOffset: {
        width: 4,
        height: 1,
      },
      shadowOpacity: 0.15,
      shadowRadius: 3,
      elevation: 10,
      marginBottom: 5,
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
