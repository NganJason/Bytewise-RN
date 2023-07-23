import React, { useEffect, useRef } from 'react';
import { Animated, Image, StyleSheet } from 'react-native';

const logo = require('../../../assets/images/logo.png');

const SplashScreen = () => {
  const fadeAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const fadeIn = () => {
      Animated.timing(fadeAnimation, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }).start();
    };
    const fadeOut = () => {
      Animated.timing(fadeAnimation, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start();
    };

    fadeIn();
    setTimeout(fadeOut, 1500);
  }, []);

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnimation }]}>
      <Image style={styles.image} source={logo} />
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

export default SplashScreen;
