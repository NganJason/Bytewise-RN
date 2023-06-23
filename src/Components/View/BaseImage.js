import { StyleSheet } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { Image } from '@rneui/themed';

const BaseImage = ({
  width = 0,
  height = 0,
  source = null,
  align = 'center',
  containerStyle = {},
}) => {
  const styles = getStyles();

  return (
    <Animated.View
      entering={FadeIn.duration(300)}
      style={{
        alignSelf: align,
        width: width,
        height: height,
        ...containerStyle,
      }}>
      <Image source={source} style={styles.img} />
    </Animated.View>
  );
};

const getStyles = () =>
  StyleSheet.create({
    img: {
      width: '100%',
      height: '100%',
      resizeMode: 'contain',
    },
  });

export default BaseImage;
