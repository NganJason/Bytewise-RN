import { Overlay } from '@rneui/themed';
import { StyleSheet, View } from 'react-native';

const BaseOverlay = ({
  children,
  isVisible = false,
  onBackdropPress = function () {},
  overlayStyle = {},
  contentStyle = {},
}) => {
  const styles = getStyles();

  return (
    <Overlay
      isVisible={isVisible}
      onBackdropPress={onBackdropPress}
      overlayStyle={{ ...styles.defaultOverlayStyle, ...overlayStyle }}>
      <View style={{ ...styles.content, ...contentStyle }}>{children}</View>
    </Overlay>
  );
};

const getStyles = _ =>
  StyleSheet.create({
    defaultOverlayStyle: {
      width: '90%',
      borderRadius: 10,
    },
    content: { padding: 20 },
  });

export default BaseOverlay;
