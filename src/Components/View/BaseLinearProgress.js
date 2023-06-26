import { useTheme, LinearProgress } from '@rneui/themed';
import { StyleSheet } from 'react-native';

const BaseLinearProgress = ({ value = 0 }) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  const getColor = () => {
    if (value >= 1) {
      return theme.colors.lightRed;
    }
    return theme.colors.color2;
  };

  return (
    <LinearProgress
      style={styles.progressBar}
      trackColor={theme.colors.color9}
      color={getColor()}
      value={value}
    />
  );
};

export default BaseLinearProgress;

const getStyles = _ =>
  StyleSheet.create({
    progressBar: {
      height: 2.5,
      borderRadius: 10,
    },
  });
