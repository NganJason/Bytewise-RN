import { useTheme } from '@rneui/themed';
import { StyleSheet, View } from 'react-native';
import BaseText from '../Text/BaseText';

const BaseLinearProgress = ({ value = 0, showPercentage = false }) => {
  const { theme } = useTheme();

  const getColor = () => {
    if (value >= 1) {
      return theme.colors.regularRed;
    } else if (value >= 0.6) {
      return theme.colors.lightRed;
    }
    return theme.colors.color1;
  };

  const getPercentage = val => {
    let percentage = val * 100;
    return percentage.toFixed(0);
  };

  return (
    <>
      <ProgressBar
        progressPercentage={getPercentage(value)}
        color={getColor()}
      />
      {showPercentage && (
        <BaseText text4 style={{ color: theme.colors.color7 }}>
          {getPercentage(value)}%
        </BaseText>
      )}
    </>
  );
};

const ProgressBar = ({ progressPercentage = 0, color }) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  const getProgressPercentage = () => {
    if (progressPercentage > 100) {
      return 100;
    }
    return progressPercentage;
  };

  const progressBarStyle = {
    width: `${getProgressPercentage()}%`,
    backgroundColor: color,
  };

  return (
    <View style={styles.progressBarContainer}>
      <View style={[styles.progressBar, progressBarStyle]} />
    </View>
  );
};

export default BaseLinearProgress;

const getStyles = theme =>
  StyleSheet.create({
    progressBarContainer: {
      height: 6,
      borderRadius: 10,
      backgroundColor: theme.colors.color9,
      //flex: 1,
    },
    progressBar: {
      height: '100%',
      borderRadius: 8,
    },
  });
