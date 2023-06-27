import { useTheme } from '@rneui/themed';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import useDimension from '../../_shared/hooks/dimension';
import { BackIcon, DrawerIcon } from '../Common/Icon';
import HideKeyboard from './HideKeyboard';

const BaseScreen3 = ({
  headerProps = {
    component: null,
    allowBack: false,
    allowDrawer: false,
  },
  children,
}) => {
  const { theme } = useTheme();
  const { screenHeight, screenWidth } = useDimension();
  const styles = getStyles(theme, screenHeight, screenWidth);

  const [floatingHeaderHeight, setFloatingHeaderHeight] = useState(
    screenHeight * 0.2,
  );

  const onFloatingHeaderResize = newHeight => {
    setFloatingHeaderHeight(newHeight);
  };

  const calculateContentMarginTop = () => {
    const floatingHeaderMinHeight = screenHeight * 0.2;

    let extraMarginTop = (screenHeight * 0.14) / 2;
    if (floatingHeaderHeight > floatingHeaderMinHeight) {
      extraMarginTop += floatingHeaderHeight - floatingHeaderMinHeight;
    }

    return extraMarginTop;
  };

  return (
    <HideKeyboard>
      <>
        <SafeAreaView style={styles.header}>
          <>
            {headerProps.allowDrawer && <DrawerIcon />}
            {headerProps.allowBack && <BackIcon />}
          </>
        </SafeAreaView>
        <View
          style={[styles.floatingHeader, { minHeight: floatingHeaderHeight }]}
          onLayout={event =>
            onFloatingHeaderResize(event.nativeEvent.layout.height)
          }>
          {headerProps.component}
        </View>
        <View style={styles.body}>
          <View
            style={[
              styles.content,
              { marginTop: calculateContentMarginTop() },
            ]}>
            {children}
          </View>
        </View>
      </>
    </HideKeyboard>
  );
};

const getStyles = (theme, screenHeight, screenWidth) =>
  StyleSheet.create({
    header: {
      minHeight: screenHeight * 0.25,
      paddingHorizontal: 26,
      backgroundColor: theme.colors.veryLightBlue,
    },
    floatingHeader: {
      minHeight: screenHeight * 0.2,
      width: screenWidth * 0.9,
      position: 'absolute',
      top: '12.5%',
      left: (screenWidth - screenWidth * 0.9) / 2,
      backgroundColor: theme.colors.white,
      shadowColor: theme.colors.black,
      shadowOffset: {
        width: 2,
        height: -5,
      },
      shadowOpacity: 0.25,
      shadowRadius: 10,
      elevation: 10,
      zIndex: 30,
      borderRadius: 12,
    },
    body: {
      flex: 1,
      minHeight: '100%',
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
      zIndex: 1,
    },
    content: {
      flex: 1,
    },
  });

export default BaseScreen3;
