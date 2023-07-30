import { useTheme } from '@rneui/themed';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import useDimension from '../../_shared/hooks/dimension';
import { BackIcon, DrawerIcon } from '../Common/Icon';
import HideKeyboard from './HideKeyboard';

const headerPercentage = 0.25;
const floatingHeaderPercentage = 0.2;

const BaseScreen3 = ({
  headerProps = {
    component: null,
    allowBack: false,
    allowDrawer: false,
    backgroundColor: '#F3F7FB',
  },
  children,
}) => {
  const { theme } = useTheme();
  const { screenHeight, screenWidth } = useDimension();
  const styles = getStyles(theme, screenHeight, screenWidth);
  const floatingHeaderMinHeight = screenHeight * floatingHeaderPercentage;
  const { backgroundColor: headerColor = '#F3F7FB' } = headerProps || {};

  const [floatingHeaderHeight, setFloatingHeaderHeight] = useState(
    floatingHeaderMinHeight,
  );

  const onFloatingHeaderResize = newHeight => {
    setFloatingHeaderHeight(newHeight);
  };

  const calculateContentMarginTop = () => {
    let marginTop = floatingHeaderMinHeight / 2.3;
    marginTop += floatingHeaderHeight - floatingHeaderMinHeight;
    return marginTop;
  };

  return (
    <HideKeyboard>
      <>
        <SafeAreaView style={[styles.header, { backgroundColor: headerColor }]}>
          <>
            {headerProps.allowDrawer && <DrawerIcon />}
            {headerProps.allowBack && <BackIcon />}
          </>
        </SafeAreaView>
        <View
          style={styles.floatingHeader}
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
      minHeight: screenHeight * headerPercentage,
      paddingHorizontal: 26,
    },
    floatingHeader: {
      minHeight: screenHeight * floatingHeaderPercentage,
      width: screenWidth * 0.9,
      padding: 16,
      position: 'absolute',
      top: `${(headerPercentage / 2) * 100}%`,
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
      zIndex: 2,
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
    },
    content: {
      flex: 1,
    },
  });

export default BaseScreen3;
