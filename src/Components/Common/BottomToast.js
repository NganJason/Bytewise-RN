import { BottomSheet, useTheme } from '@rneui/themed';
import { useContext } from 'react';
import { StyleSheet, View } from 'react-native';
import { BottomToastContext, ToastTypeInfo } from '../../_shared/context';
import { useDimension } from '../../_shared/hooks';
import { BaseText } from '../Text';
import { IconButton } from '../Touch';

const BottomToast = () => {
  const { theme } = useTheme();
  const { screenHeight } = useDimension();
  const styles = getStyles(theme, screenHeight);

  const { isVisible, close, toastInfo } = useContext(BottomToastContext);

  const renderContent = () => {
    switch (toastInfo.toastType) {
      case ToastTypeInfo:
        return <InfoToast toastInfo={toastInfo} />;
      default:
        return;
    }
  };

  return (
    <BottomSheet
      fullScreen={true}
      scrollViewProps={{
        showsVerticalScrollIndicator: false,
      }}
      isVisible={isVisible}
      onBackdropPress={close}>
      <View style={styles.container}>
        <View style={styles.header}>
          <IconButton
            iconName="close"
            iconType="antdesign"
            type="clear"
            color={theme.colors.color8}
            iconSize={20}
            align="flex-end"
            onPress={close}
          />
        </View>
        <View style={styles.body}>{renderContent()}</View>
      </View>
    </BottomSheet>
  );
};

const InfoToast = ({ toastInfo = {} }) => {
  return (
    <View>
      <BaseText h3 margin={{ bottom: 6 }}>
        {toastInfo.title}
      </BaseText>
      <BaseText text3>{toastInfo.text}</BaseText>
    </View>
  );
};

export default BottomToast;

const getStyles = (theme, screenHeight) =>
  StyleSheet.create({
    container: {
      flex: 1,
      minHeight: screenHeight * 0.2,
      backgroundColor: theme.colors.white,
      borderRadius: 15,
      paddingTop: theme.spacing.md,
      paddingBottom: 42,
      paddingHorizontal: theme.spacing.lg,
    },
    header: {
      width: '100%',
      paddingHorizontal: 6,
      flexDirection: 'row',
      justifyContent: 'flex-end',
      marginTop: theme.spacing.md,
    },
    body: {
      flex: 1,
      paddingHorizontal: theme.spacing.lg,
    },
  });
