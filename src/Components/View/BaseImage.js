import { useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

const BaseImage = ({
  width = 0,
  height = 0,
  source = null,
  containerStyle = {},
}) => {
  const [isLoaded, setLoaded] = useState(false);
  const styles = getStyles();

  const handleLoad = () => {
    setLoaded(true);
  };

  return (
    <View style={{ width: width, height: height, ...containerStyle }}>
      {!isLoaded ? (
        <Image
          source={source}
          onLoad={handleLoad}
          style={styles.imgPlaceholder}
        />
      ) : (
        <Animated.View entering={FadeIn.duration(300)}>
          <Image source={source} style={styles.img} />
        </Animated.View>
      )}
    </View>
  );
};

const getStyles = () =>
  StyleSheet.create({
    imgPlaceholder: {
      opacity: 0,
    },
    img: {
      width: '100%',
      height: '100%',
    },
  });

export default BaseImage;
