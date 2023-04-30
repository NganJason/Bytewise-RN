import { Header } from '@rneui/base';
import { BottomSheet, useTheme } from '@rneui/themed';
import { StyleSheet, View } from 'react-native';

const BaseBottomSheetModal = ({
  isVisible = false,
  close = function () {},
  headerProps = {
    leftComponent: null,
    leftComponentStyle: {},
    centerComponent: null,
    centerComponentStyle: {},
  },
  bodyStyle = {},
  children,
}) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  return (
    <BottomSheet
      fullScreen={true}
      isVisible={isVisible}
      onBackdropPress={close}>
      <View style={styles.container}>
        <Header
          containerStyle={styles.header}
          leftComponent={headerProps.leftComponent}
          leftContainerStyle={headerProps.leftComponentStyle}
          centerComponent={headerProps.centerComponent}
          centerContainerStyle={headerProps.centerComopnentStyle}
        />
        <View style={{ ...styles.defaultBody, ...bodyStyle }}>{children}</View>
      </View>
    </BottomSheet>
  );
};

const getStyles = theme =>
  StyleSheet.create({
    header: {
      backgroundColor: theme.colors.white,
    },
    container: {
      backgroundColor: theme.colors.white,
      padding: 20,
    },
    defaultBody: {
      paddingVertical: 30,
    },
  });

export default BaseBottomSheetModal;
