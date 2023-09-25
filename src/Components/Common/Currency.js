import { useTheme } from '@rneui/themed';
import { StyleSheet, View } from 'react-native';
import CountryFlag from 'react-native-country-flag';
import { currencies } from '../../_shared/util';
import { BaseText } from '../Text';

const Currency = ({ code = 'SGD' }) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  return (
    <View style={styles.container}>
      <CountryFlag
        isoCode={currencies[code].iso_code}
        size={14}
        style={styles.icon}
      />
      <BaseText text3>{currencies[code].name}</BaseText>
    </View>
  );
};

const getStyles = theme =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: theme.spacing.lg,
    },
    icon: {
      marginRight: theme.spacing.lg,
    },
  });

export default Currency;
