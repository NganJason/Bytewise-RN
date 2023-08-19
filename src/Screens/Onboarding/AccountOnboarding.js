import { useNavigation } from '@react-navigation/native';
import { useTheme } from '@rneui/themed';
import { StyleSheet, View } from 'react-native';
import { BaseText } from '../../Components';

const AccountOnboarding = ({ data = {}, setData = function () {} }) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View>
        <BaseText h1>Setup your</BaseText>
        <BaseText h1>accounts</BaseText>
        <BaseText text2 style={styles.subtitle}>
          Accounts keep track of both your money and net worth
        </BaseText>
      </View>
    </View>
  );
};

const getStyles = theme => {
  return StyleSheet.create({
    container: {
      flex: 1,
    },
    subtitle: {
      marginTop: 10,
      marginBottom: 12,
      color: theme.colors.color8,
    },
  });
};

export default AccountOnboarding;
