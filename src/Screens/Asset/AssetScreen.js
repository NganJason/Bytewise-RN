import { useTheme } from '@rneui/themed';
import { StyleSheet, View } from 'react-native';
import { BaseHeader, BaseScreen, BaseText } from '../../Components';
import AssetRow from './AssetRow';

const AssetScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  return (
    <BaseScreen>
      <BaseHeader
        leftComponent={
          <View>
            <BaseText h3 style={{ color: theme.colors.grey2 }}>
              You have
            </BaseText>
            <BaseText
              h1
              style={{
                color: theme.colors.primary,
                marginVertical: theme.spacing.lg,
              }}>
              S$ 20,000
            </BaseText>
            <BaseText h3 style={{ color: theme.colors.grey2 }}>
              Projected S$40,000 by Dec 2023
            </BaseText>
          </View>
        }
        leftContainerStyle={styles.header}
      />

      <View style={styles.body}>
        <AssetRow assetType={'Asset'} navigation={navigation} />
        <AssetRow assetType={'Debt'} navigation={navigation} />
      </View>
    </BaseScreen>
  );
};

const getStyles = theme => {
  return StyleSheet.create({
    header: { maxWidth: '100%' },
    body: {
      marginTop: theme.spacing.xl,
    },
  });
};

export default AssetScreen;
