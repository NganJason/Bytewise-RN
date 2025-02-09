import { StyleSheet, View, Image } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useState } from 'react';

const BaseImage = ({
  width = 0,
  height = 0,
  maxHeight = null,
  source = null,
  align = 'center',
  containerStyle = {},
  resizeMode = 'contain',
}) => {
  const styles = getStyles({ resizeMode });
  const [imageLoaded, setImageLoaded] = useState(false);

  const onImageLoad = () => {
    setImageLoaded(true);
  };

  return (
    <>
      {!imageLoaded ? (
        <View
          style={{
            alignSelf: align,
            width: width,
            height: height,
            maxHeight: maxHeight,
            ...containerStyle,
          }}>
          <Image
            source={source}
            style={{ ...styles.imgPlaceholder }}
            onLoad={onImageLoad}
          />
        </View>
      ) : (
        <Animated.View
          entering={FadeIn.duration(300)}
          style={{
            alignSelf: align,
            width: width,
            height: height,
            maxHeight: maxHeight,
            ...containerStyle,
          }}>
          <Image source={source} style={styles.img} />
        </Animated.View>
      )}
    </>
  );
};

const getStyles = ({ resizeMode }) =>
  StyleSheet.create({
    imgPlaceholder: {
      width: '100%',
      height: '100%',
      opacity: 0,
    },
    img: {
      width: '100%',
      height: '100%',
      resizeMode: resizeMode,
    },
  });

export default BaseImage;
