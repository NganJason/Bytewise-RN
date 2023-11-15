import { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '@rneui/themed';
import { LineChart } from 'react-native-gifted-charts';
import { EmptyContent } from '../Common';
import { BaseText } from '../Text';

import { useDimension } from '../../_shared/hooks';

const NUM_OF_SECTIONS = 5;
const LOWER_LIMIT = -100;
const UPPER_LIMIT = 100;

const BaseLineChart = ({
  title = '',
  data = [],
  onTouchStart = () => {},
  onTouchEnd = () => {},
  pointerLabelComponent = item => null,
} = {}) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  const [containerWidth, setContainerWidth] = useState(0);
  const { screenHeight } = useDimension();

  const chartHeight = screenHeight * 0.35;

  const scaleDataToRange = () => {
    const vals = data.map(d => d.value);
    const min = Math.min(...vals);
    const max = Math.max(...vals);

    return vals.map((v, i) => {
      let percentChange = 0;
      if (i > 0) {
        percentChange = (
          ((data[i].value - data[i - 1].value) / data[i - 1].value) *
          100
        ).toFixed(2);
      }

      console.log(i, percentChange);

      return {
        value:
          ((v - min) / (max - min)) * (UPPER_LIMIT - LOWER_LIMIT) + LOWER_LIMIT,
        labelText: data[i].labelText || '',
        rawValue: data[i].value,
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
    <View>
      <BaseText>{title}</BaseText>
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
              isAnimated
              adjustToWidth
              noOfSections={NUM_OF_SECTIONS}
              noOfSectionsBelowXAxis={NUM_OF_SECTIONS}
              stepValue={UPPER_LIMIT / NUM_OF_SECTIONS}
              stepHeight={chartHeight / (NUM_OF_SECTIONS * 2 + 1)}
              initialSpacing={10}
              endSpacing={0}
              maxValue={UPPER_LIMIT}
              mostNegativeValue={LOWER_LIMIT - 50}
              color={theme.colors.color2}
              thickness={2}
              hideDataPoints
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
                pointerLabelComponent: pointerLabelComponent,
              }}
            />
          </>
        )}
      </View>
    </View>
  );
};

const getStyles = _ => {
  return StyleSheet.create({
    container: {
      width: '100%',
      backgroundColor: 'yellow',
    },
  });
};

export default BaseLineChart;
