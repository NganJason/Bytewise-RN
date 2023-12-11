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
  showMinMax = false,
} = {}) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  const [containerWidth, setContainerWidth] = useState(0);
  const [touched, setTouched] = useState(false);

  const scaleDataToRange = () => {
    const vals = data.map(d => Number(d.value));
    const min = Math.min(...vals);
    const max = Math.max(...vals);

    let ds = data.map((d, i) => {
      let normalizedValue = d.value;
      if (max - min !== 0) {
        normalizedValue =
          ((Number(d.value) - min) / (max - min)) *
            (UPPER_LIMIT - LOWER_LIMIT) +
          LOWER_LIMIT;
      }

      return {
        ...d,
        // internal field
        idx: i,
        rawValue: d.value,
        // library field
        value: Number(normalizedValue),
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

    if (showMinMax) {
      let [minIdx, maxIdx] = getLowestHighestValIdx(items.map(d => d.value));
      // if equal, we ignore
      if (minIdx !== maxIdx) {
        items[minIdx].hideDataPoint = false;
        items[minIdx].dataPointText = items[minIdx].rawValue;
        items[minIdx].textShiftY = 16;
        items[minIdx].textShiftX = getTextShiftX(
          minIdx,
          items[minIdx].rawValue,
        );

        items[maxIdx].hideDataPoint = false;
        items[maxIdx].dataPointText = items[maxIdx].rawValue;
        items[maxIdx].textShiftY = -6;
        items[maxIdx].textShiftX = getTextShiftX(
          maxIdx,
          items[maxIdx].rawValue,
        );
      }
    }

    return items;
  };

  const getTextShiftX = (idx, text = '') => {
    if (idx === 0) {
      return 5 * text.length;
    }
    if (idx === data.length - 1) {
      return -5 * text.length;
    }
    return 0;
  };

  const isDataEmpty = () => {
    return data.length === 0;
  };

  return (
    <View
      style={{
        ...styles.container,
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
      paddingVertical: 10,
    },
  });
};

export default BaseLineChart;
