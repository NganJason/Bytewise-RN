import { Overlay } from '@rneui/themed';
import { StyleSheet, View } from 'react-native';
import IconButton from '../Touch/IconButton';

const BaseOverlay = ({
  children,
  isVisible = false,
  onBackdropPress = function () {},
  onClose = function () {},
  overlayStyle = {},
  contentStyle = {},
}) => {
  const styles = getStyles();

  return (
    <Overlay
      isVisible={isVisible}
      onBackdropPress={onBackdropPress}
      overlayStyle={{ ...styles.defaultContainerStyle, ...overlayStyle }}>
      <View>
        <View style={styles.closeBtn}>
          <IconButton
            iconName="cross"
            iconType="entypo"
            type="clear"
            buttonSize="sm"
            align=""
            onPress={onClose}
          />
        </View>
        <View style={{ ...styles.content, ...contentStyle }}>{children}</View>
      </View>
    </Overlay>
  );
};

const getStyles = _ =>
  StyleSheet.create({
    defaultContainerStyle: { width: '90%' },
    closeBtn: {
      width: '100%',
      flexDirection: 'row',
      justifyContent: 'flex-end',
    },
    content: { padding: 20 },
  });

export default BaseOverlay;
