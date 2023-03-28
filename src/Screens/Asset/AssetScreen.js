import { useTheme } from '@rneui/themed';
import { StyleSheet, View } from 'react-native';
import { BaseScreen, BaseText } from '../../Components';

const AssetScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  return (
    <BaseScreen>
      <View style={styles.header}>
        <BaseText h3>Hi Jason</BaseText>
        <BaseText h1>S$ 20,000</BaseText>
        <BaseText h3>Projected S$40,000 by Dec 2023</BaseText>
      </View>
    </BaseScreen>
  );
};

const getStyles = theme => {
  return StyleSheet.create({
    screen: {
      padding: theme.spacing.xl,
    },
  });
};

export default AssetScreen;
