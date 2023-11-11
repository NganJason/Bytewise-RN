import { useTheme } from '@rneui/themed';
import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

const WAIT_TIME_FOR_INDICATOR = 500;

const BaseLoadableViewV2 = ({ isLoading = false, children }) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);
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
        <Animated.View entering={FadeIn.duration(300)} style={styles.body}>
          {children}
        </Animated.View>
      );
    }
  };

  return <>{renderBody()}</>;
};

const getStyles = _ =>
  StyleSheet.create({
    body: {
      flex: 1,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });

export default BaseLoadableViewV2;
