import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { DefaultChartColors } from '../../_shared/constant/constant';
import BaseDonutChart from './BaseDonutChart';
import BaseRow from '../View/BaseRow';
import ChartLegend from './ChartLegend';
import { AmountText, BaseText } from '../Text';
import { BaseDivider, BaseLoadableView } from '../View';
import { useTheme } from '@rneui/themed';
import { genColors } from '../../_shared/util';

const BaseDonutChartWithRows = ({
  items = [{ name: '', value: 0, onPress: function () {} }],
  donutInnerLabel = { title: '', subtitle: '' },
  donutRadius = 100,
  isLoading = false,
  emptyContent = <></>,
}) => {
  const [processedItems, setProcessedItems] = useState([]);
  const { theme } = useTheme();
  const styles = getStyles(theme);

  function generateColors(numColors) {
    if (numColors <= DefaultChartColors.length) {
      return DefaultChartColors;
    }
    // Only gen colors if needed
    return genColors(numColors);
  }

  useEffect(() => {
    let p = [];
    let sum = 0;
    items.map(d => (sum += d.value));
    let colors = generateColors(items.length);

    items.map((d, idx) => {
      if (d.name === '') {
        return;
      }
      d.color = colors[idx];
      let percentage = (d.value / sum) * 100;
      if (isNaN(percentage)) {
        percentage = 0;
      }
      d.percentage = percentage.toFixed(0);
      p.push(d);
    });
    setProcessedItems(p);
  }, [items]);

  const renderRows = () => {
    let rows = [];

    processedItems.map((d, idx) => {
      rows.push(
        <BaseRow key={idx} onPress={d.onPress}>
          <ChartLegend color={d.color} text={d.name} text3 />
          <View style={styles.rowValue}>
            <AmountText text3>{d.value}</AmountText>
            <BaseText
              text5
              margin={{ left: 10 }}
              color={theme.colors.color7}>{`(${d.percentage}%)`}</BaseText>
          </View>
        </BaseRow>,
      );
    });

    if (rows.length === 0) {
      return emptyContent;
    }

    return rows;
  };

  return (
    <View style={styles.container}>
      <BaseDonutChart
        items={processedItems}
        innerLabel={donutInnerLabel}
        radius={donutRadius}
      />
      {processedItems.length === 0 && <BaseDivider margin={10} />}
      <BaseLoadableView
        scrollable
        containerStyle={styles.rowsContainer}
        isLoading={isLoading}>
        {renderRows()}
      </BaseLoadableView>
    </View>
  );
};

const getStyles = theme =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    rowsContainer: {
      flex: 1,
    },
    rowValue: {
      flexDirection: 'row',
      alignItems: 'center',
    },
  });

export default BaseDonutChartWithRows;
