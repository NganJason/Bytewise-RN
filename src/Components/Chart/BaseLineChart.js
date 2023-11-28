import { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '@rneui/themed';
import { LineChart } from 'react-native-gifted-charts';
import { EmptyContent } from '../Common';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { BaseText } from '../Text';

const NUM_OF_SECTIONS = 5;
const LOWER_LIMIT = -100;
const UPPER_LIMIT = 100;

const BaseLineChart = ({
  data = [],
  onTouchStart = () => {},
  onTouchEnd = () => {},
  handleActiveData = () => {},
  chartHeight = 0,
  granularities = [],
  granularityIdx = 0,
  onGranularityChange = function (idx) {},
} = {}) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  const [containerWidth, setContainerWidth] = useState(0);

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
          {granularities.length > 0 && (
            <GranularityTab
              items={granularities}
              onPress={onGranularityChange}
              activeIdx={granularityIdx}
            />
          )}
        </>
      )}
    </View>
  );
};

const GranularityTab = ({
  items = [],
  activeIdx = 0,
  onPress = function (idx) {},
}) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  const isActive = i => {
    return activeIdx === i;
  };

  return (
    <View style={styles.granularityContainer}>
      {items.map((d, i) => {
        return (
          <TouchableOpacity
            key={i}
            onPress={() => onPress(i)}
            style={[
              styles.granularityItem,
              isActive(i) && styles.activeGranularity,
            ]}>
            <BaseText
              text4
              style={[
                styles.granularityText,
                isActive(i) && styles.activeGranularityText,
              ]}>
              {d.name}
            </BaseText>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const getStyles = theme => {
  return StyleSheet.create({
    container: {
      width: '100%',
    },
    granularityContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'center',
    },
    granularityItem: {
      borderRadius: 10,
      paddingHorizontal: 18,
      alignItems: 'center',
      paddingVertical: 2,
    },
    activeGranularity: {
      backgroundColor: theme.colors.color8,
    },
    granularityText: {
      color: theme.colors.color8,
    },
    activeGranularityText: {
      color: theme.colors.white,
    },
  });
};

export default BaseLineChart;
