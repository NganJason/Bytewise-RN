import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { DefaultChartColors } from '../../_shared/constant/constant';
import BaseDonutChart from './BaseDonutChart';
import BaseRow from '../View/BaseRow';
import ChartLegend from './ChartLegend';
import { AmountText, BaseText } from '../Text';
import { BaseDivider, BaseLoadableView } from '../View';
import { useTheme } from '@rneui/themed';
import { DEFAULT_CURRENCY, genColors } from '../../_shared/util';
import { Amount } from '../../_shared/object';

const BaseDonutChartWithRows = ({
  items = [
    { name: '', value: 0, currency: DEFAULT_CURRENCY, onPress: function () {} },
  ],
  donutInnerLabel = { title: null, subtitle: null },
  donutRadius = 100,
  isLoading = false,
  emptyContent = <></>,
  rowSensitive = false,
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
    items.map(d => (sum += Number(d.value)));

    let colors = generateColors(items.length);
    items.sort((a, b) => {
      return a.name.localeCompare(b.name);
    });

    items.map((d, idx) => {
      if (d.name === '') {
        return;
      }
      d.color = colors[idx];
      let percentage = (Math.abs(d.value) / sum) * 100;
      if (isNaN(percentage)) {
        percentage = 0;
      }
      d.percentage = percentage.toFixed(1);
      p.push(d);
    });

    p.sort((a, b) => b.value - a.value);
    setProcessedItems(p);
  }, [items]);

  const renderRows = () => {
    let rows = [];

    processedItems.map((d, idx) => {
      rows.push(
        <BaseRow
          key={idx}
          disabled={!d.onPress}
          onPress={d.onPress && d.onPress}>
          <View style={styles.legend}>
            <ChartLegend color={d.color} text={d.name} text3 />
          </View>
          <View style={styles.rowValue}>
            <AmountText
              text3
              amount={new Amount(d.value, d.currency)}
              showNegativeOnly
              sensitive={rowSensitive}
            />
            <BaseText
              text5
              margin={{ left: 10 }}
              numberOfLines={1}
              ellipsizeMode="tail"
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
    legend: {
      flex: 1,
    },
    rowValue: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-end',
    },
  });

export default BaseDonutChartWithRows;
