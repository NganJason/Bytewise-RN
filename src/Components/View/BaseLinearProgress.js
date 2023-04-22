import { useTheme, LinearProgress } from '@rneui/themed';
import { StyleSheet } from 'react-native';

const BaseLinearProgress = ({ value = 0 }) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  return (
    <LinearProgress
      style={styles.progressBar}
      trackColor={theme.colors.color2}
      color={theme.colors.color1}
      value={value}
    />
  );
};

export default BaseLinearProgress;

const getStyles = _ =>
  StyleSheet.create({
    progressBar: {
      height: 6,
    },
  });
