import { useTheme } from '@rneui/themed';
import { View, StyleSheet } from 'react-native';

const BaseHeader = ({ left, center, right }) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  return (
    <View style={styles.header}>
      <View>{left}</View>
      <View>{center}</View>
      <View>{right}</View>
    </View>
  );
};

const getStyles = theme => {
  return StyleSheet.create({
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: theme.spacing.xl,
    },
  });
};

export default BaseHeader;
