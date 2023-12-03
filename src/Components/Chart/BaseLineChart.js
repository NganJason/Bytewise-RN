import { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '@rneui/themed';
import { LineChart } from 'react-native-gifted-charts';
import EmptyContent from '../Common/EmptyContent';
import { getLowestHighestValIdx } from '../../_shared/util';

const NUM_OF_SECTIONS = 5;
const LOWER_LIMIT = -100;
const UPPER_LIMIT = 100;

const BaseLineChart = ({
  data = [],
  onTouchStart = () => {},
  onTouchEnd = () => {},
  handleActiveData = () => {},
  chartHeight = 0,
  hideDataPoints = true,
  withPointer = true,
  showLowestHighest = true,
} = {}) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  const [containerWidth, setContainerWidth] = useState(0);
  const [touched, setTouched] = useState(false);

  const scaleDataToRange = () => {
    const vals = data.map(d => d.value);
    const min = Math.min(...vals);
    const max = Math.max(...vals);

    let ds = data.map((d, i) => {
      const normalizedValue =
        ((d.value - min) / (max - min)) * (UPPER_LIMIT - LOWER_LIMIT) +
        LOWER_LIMIT;

      return {
        ...d,
        // internal field
        idx: i,
        rawValue: d.value,
        // library field
        value: normalizedValue,
      };
    });

    return ds;
  };

  const getSpacing = () => {
    const chartWidth = containerWidth - 35;
    if (data.length > 1) {
      return chartWidth / (data.length - 1);
    }
    return chartWidth;
  };

  const processData = (items = []) => {
    if (hideDataPoints) {
      items = items.map(d => {
        d.hideDataPoint = true;
        return d;
      });
    }

    if (withPointer) {
      items = items.map((d, idx) => {
        if (idx === items.length - 1 && !touched) {
          d.hideDataPoint = false;
          d.customDataPoint = LineChartPointer;
        }
        return d;
      });
    }

    if (showLowestHighest) {
      let [minIdx, maxIdx] = getLowestHighestValIdx(items.map(d => d.value));

      // if equal, we ignore
      if (minIdx !== maxIdx) {
        items[minIdx].hideDataPoint = false;
        items[minIdx].dataPointText = 'min';
        items[minIdx].textShiftY = 15;

        items[maxIdx].hideDataPoint = false;
        items[maxIdx].dataPointText = 'max';
        items[maxIdx].textShiftY = -5;
      }
    }

    return items;
  };

  const isDataEmpty = () => {
    return data.length === 0;
  };

  return (
    <View
      style={{
        ...styles.container,
        height: chartHeight,
      }}
      onTouchStart={() => {
        setTouched(true);
        onTouchStart();
      }}
      onTouchEnd={() => {
        setTouched(false);
        onTouchEnd();
      }}
      onLayout={event => {
        const { width } = event.nativeEvent.layout;
        setContainerWidth(width);
      }}>
      <View style={{ height: chartHeight }}>
        {isDataEmpty() ? (
          <EmptyContent enableImage={false} />
        ) : (
          <>
            <LineChart
              data={processData(scaleDataToRange())}
              isAnimated
              adjustToWidth
              dataPointsColor={theme.colors.color1}
              noOfSections={NUM_OF_SECTIONS}
              noOfSectionsBelowXAxis={NUM_OF_SECTIONS}
              stepValue={UPPER_LIMIT / NUM_OF_SECTIONS}
              stepHeight={(chartHeight * 0.95) / (NUM_OF_SECTIONS * 2 + 1)}
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
                showPointerStrip: false,
                pointerComponent: LineChartPointer,
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
    </View>
  );
};

const LineChartPointer = () => {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  return <View style={styles.chartPointer} />;
};

const getStyles = theme => {
  return StyleSheet.create({
    chartPointer: {
      width: 14,
      height: 14,
      backgroundColor: 'white',
      borderWidth: 3,
      borderRadius: 6,
      borderColor: theme.colors.color2,
    },
    container: {
      width: '100%',
    },
  });
};

export default BaseLineChart;
