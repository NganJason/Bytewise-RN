import { useTheme } from '@rneui/themed';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { PacmanIndicator } from 'react-native-indicators';
import Animated, { FadeIn } from 'react-native-reanimated';
import BaseScrollView from './BaseScrollView';

const WAIT_TIME_FOR_INDICATOR = 500;

const BaseLoadableView = ({
  isLoading = false,
  scrollable = false,
  containerStyle = {},
  children,
}) => {
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

  return (
    <View style={styles.body}>
      {showLoadingIndicator && (
        <PacmanIndicator size={70} color={theme.colors.primary} />
      )}

      {!showLoadingIndicator && !isLoading && (
        <Animated.View
          entering={FadeIn.duration(300)}
          style={[styles.container, containerStyle]}>
          {scrollable ? (
            <BaseScrollView showsVerticalScrollIndicator={false}>
              {children}
            </BaseScrollView>
          ) : (
            <>{children}</>
          )}
        </Animated.View>
      )}
    </View>
  );
};

const getStyles = _ =>
  StyleSheet.create({
    body: { minHeight: '100%' },
    container: { flex: 1 },
  });

export default BaseLoadableView;
