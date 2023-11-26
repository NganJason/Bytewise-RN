import { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '@rneui/themed';
import { LineChart } from 'react-native-gifted-charts';
import { EmptyContent } from '../Common';

const NUM_OF_SECTIONS = 5;
const LOWER_LIMIT = -100;
const UPPER_LIMIT = 100;

const BaseLineChart = ({
  data = [],
  onTouchStart = () => {},
  onTouchEnd = () => {},
  handleActiveData = () => {},
  chartHeight = 0,
} = {}) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  const [containerWidth, setContainerWidth] = useState(0);

  const scaleDataToRange = () => {
    const vals = data.map(d => d.value);
    const min = Math.min(...vals);
    const max = Math.max(...vals);

    return data.map((d, i) => {
      return {
        ...d,
        // internal field
        idx: i,
        rawValue: d.value,
        // library field
        value:
          ((d.value - min) / (max - min)) * (UPPER_LIMIT - LOWER_LIMIT) +
          LOWER_LIMIT,
      };
    });
  };

  const getSpacing = () => {
    const chartWidth = containerWidth - 35;
    if (data.length > 1) {
      return chartWidth / (data.length - 1);
    }
    return chartWidth;
  };

  const isDataEmpty = () => {
    return data.length === 0 || data.every(d => d.value === 0);
  };

  return (
    <View
      style={{ ...styles.container, height: chartHeight }}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      onLayout={event => {
        const { width } = event.nativeEvent.layout;
        setContainerWidth(width);
      }}>
      {isDataEmpty() ? (
        <EmptyContent />
      ) : (
        <>
          <LineChart
            data={scaleDataToRange()}
            hideDataPoints
            isAnimated
            adjustToWidth
            noOfSections={NUM_OF_SECTIONS}
            noOfSectionsBelowXAxis={NUM_OF_SECTIONS}
            stepValue={UPPER_LIMIT / NUM_OF_SECTIONS}
            stepHeight={chartHeight / (NUM_OF_SECTIONS * 2 + 1)}
            initialSpacing={10}
            endSpacing={0}
            maxValue={UPPER_LIMIT + 30}
            mostNegativeValue={LOWER_LIMIT - 50}
            color={theme.colors.color1}
            thickness={2.5}
            hideYAxisText
            spacing={getSpacing()}
            yAxisThickness={0}
            xAxisThickness={0}
            hideRules
            disableScroll
            pointerConfig={{
              pointerColor: theme.colors.color1,
              showPointerStrip: false,
              radius: 6,
              pointerLabelComponent: item => {
                const { rawValue, ...fields } = item[0];
                handleActiveData({ ...fields, value: rawValue });
                return null;
              },
            }}
          />
        </>
      )}
    </View>
  );
};

const getStyles = _ => {
  return StyleSheet.create({
    container: {
      width: '100%',
    },
  });
};

export default BaseLineChart;
