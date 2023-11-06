import { useTheme } from '@rneui/themed';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import BaseText from '../Text/BaseText';

const BaseLinearProgress = ({
  value = 0,
  target = 0,
  showPercentage = false,
}) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);

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
        targetPercentage={getPercentage(target)}
        color={getColor()}
        containerStyle={showPercentage && styles.progressBarMargin}
      />
      {showPercentage && (
        <BaseText text4 style={{ color: theme.colors.color7 }}>
          {getPercentage(value)}%
        </BaseText>
      )}
    </>
  );
};

const ProgressBar = ({
  progressPercentage = 0,
  targetPercentage = 0,
  color,
  containerStyle = {},
}) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  const [containerWidth, setContainerWidth] = useState(0);

  const onContainerLayout = event => {
    const { width } = event.nativeEvent.layout;
    setContainerWidth(width);
  };

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

  const targetLineStyle = {
    position: 'absolute',
    top: -2.75,
    left: (targetPercentage / 100) * containerWidth,
    width: 1,
    height: 8,
    backgroundColor: theme.colors.color8,
  };

  return (
    <View
      style={[styles.progressBarContainer, containerStyle]}
      onLayout={onContainerLayout}>
      <View style={[styles.progressBar, progressBarStyle]} />
      {targetPercentage > 0 && <View style={targetLineStyle} />}
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
      flex: 1,
    },
    progressBar: {
      height: '100%',
      borderRadius: 8,
    },
  });
