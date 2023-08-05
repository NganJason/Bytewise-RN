import { useTheme, LinearProgress } from '@rneui/themed';
import { StyleSheet, View } from 'react-native';
import BaseText from '../Text/BaseText';

const BaseLinearProgress = ({ value = 0, showPercentage = false }) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  const getColor = () => {
    if (value >= 1) {
      return theme.colors.lightRed;
    }
    return theme.colors.color2;
  };

  const getPercentage = () => {
    let percentage = value * 100;
    return percentage.toFixed(2);
  };

  return (
    <View style={styles.container}>
      <LinearProgress
        style={[styles.progressBar, showPercentage && styles.progressBarMargin]}
        trackColor={theme.colors.color9}
        color={getColor()}
        value={value}
        animation={false}
      />

      {showPercentage && (
        <BaseText text4 style={{ color: theme.colors.color7 }}>
          {getPercentage()}%
        </BaseText>
      )}
    </View>
  );
};

export default BaseLinearProgress;

const getStyles = _ =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    progressBar: {
      height: 2.5,
      borderRadius: 10,
      flex: 1,
    },
    progressBarMargin: {
      marginRight: 10,
    },
  });
