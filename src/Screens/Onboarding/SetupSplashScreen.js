import { useTheme } from '@rneui/themed';
import React, { useContext, useEffect, useRef } from 'react';
import { ActivityIndicator, Animated, StyleSheet } from 'react-native';
import { UserMetaContext } from '../../_shared/context/UserMetaContext';

const SetupSplashScreen = () => {
  const { theme } = useTheme();
  const { setShowSetupSplashScreen } = useContext(UserMetaContext);
  const fadeAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const fadeIn = () => {
      Animated.timing(fadeAnimation, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }).start();
    };

    fadeIn();
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setShowSetupSplashScreen(false);
    }, 2000);
  }, []);

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnimation }]}>
      <ActivityIndicator size="large" color={theme.colors.color1} />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '80%',
    height: '100%',
    resizeMode: 'contain',
  },
});

export default SetupSplashScreen;
