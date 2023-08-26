import { BottomSheet, useTheme } from '@rneui/themed';
import { StyleSheet, View } from 'react-native';
import { connectionIcon } from '../../_shared/constant/asset';
import { useConnection, useDimension } from '../../_shared/hooks';
import { BaseText } from '../Text';
import { BaseImage } from '../View';

const ConnectionChecker = () => {
  const { theme } = useTheme();
  const { screenHeight } = useDimension();
  const styles = getStyles(theme, screenHeight);

  const { isConnected } = useConnection();

  return (
    <BottomSheet
      fullScreen={true}
      scrollViewProps={{
        showsVerticalScrollIndicator: false,
      }}
      isVisible={!isConnected}>
      <View style={styles.container}>
        <View style={styles.body}>
          <BaseImage source={connectionIcon} width="60%" height="60%" />
          <BaseText text1 margin={{ top: 20, bottom: 10 }}>
            No Connection Found
          </BaseText>
          <BaseText text3>Please check your network connection</BaseText>
        </View>
      </View>
    </BottomSheet>
  );
};

const getStyles = (theme, screenHeight) =>
  StyleSheet.create({
    container: {
      flex: 1,
      height: screenHeight * 0.4,
      backgroundColor: theme.colors.white,
      borderRadius: 15,
      paddingTop: theme.spacing.md,
      paddingBottom: 42,
      paddingHorizontal: theme.spacing.lg,
    },
    body: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });

export default ConnectionChecker;
